# Deployment Guide - MkDocs Documentation

This guide explains how to deploy and manage the Ta-SIEMPlus documentation site.

## 🚀 Quick Start

### Local Development

1. **Install dependencies:**
   ```bash
   pip install mkdocs mkdocs-material mike pymdown-extensions
   ```

2. **Serve locally:**
   ```bash
   mkdocs serve
   ```
   Site will be available at http://localhost:8000

3. **Build static site:**
   ```bash
   mkdocs build
   ```
   Output will be in `site/` directory

### Docker Deployment

#### Using Docker Compose (Recommended)

1. **Build and start:**
   ```bash
   docker-compose up -d
   ```

2. **Access the site:**
   - URL: http://localhost:8080
   - Health check: http://localhost:8080/health

3. **View logs:**
   ```bash
   docker-compose logs -f docs
   ```

4. **Stop:**
   ```bash
   docker-compose down
   ```

#### Using Docker directly

1. **Build image:**
   ```bash
   docker build -f Dockerfile.mkdocs -t ta-siemplus-docs:latest .
   ```

2. **Run container:**
   ```bash
   docker run -d -p 8080:80 --name ta-siemplus-docs ta-siemplus-docs:latest
   ```

3. **Stop and remove:**
   ```bash
   docker stop ta-siemplus-docs
   docker rm ta-siemplus-docs
   ```

## 📚 Versioning with Mike

Mike is used to manage documentation versions for different Wazuh releases.

### Deploy a Version

```bash
# Deploy version 4.12 and set as latest
mike deploy 4.12 latest --update-aliases

# Deploy version 4.11
mike deploy 4.11

# Deploy and push to gh-pages branch (for GitHub Pages)
mike deploy 4.12 latest --push --update-aliases
```

### Set Default Version

```bash
mike set-default latest
```

### List Versions

```bash
mike list
```

### Delete a Version

```bash
mike delete 4.11
```

### Serve Versioned Docs Locally

```bash
mike serve
```

## 🔧 Configuration

### Site Settings

Edit `mkdocs.yml` to configure:
- Site name and description
- Theme settings (colors, fonts, features)
- Navigation structure
- Plugins and extensions

### Navigation

The navigation is defined in `mkdocs.yml` under the `nav` key:

```yaml
nav:
  - Home: index.md
  - Overview:
    - overview/index.md
  - Runbooks:
    - runbooks/index.md
    - ...
```

To add a new page:
1. Create the markdown file
2. Add it to the navigation in `mkdocs.yml`
3. Rebuild the site

### Theme Customization

#### Colors

Edit `mkdocs.yml`:
```yaml
theme:
  palette:
    primary: indigo  # Change to: red, pink, purple, etc.
    accent: indigo   # Change to match primary
```

#### Features

Enable/disable features in `mkdocs.yml`:
```yaml
theme:
  features:
    - navigation.tabs        # Top-level tabs
    - navigation.sections    # Section headers
    - search.suggest        # Search suggestions
    - content.code.copy     # Copy code button
```

### Custom CSS and JavaScript

Add custom styles in `docs/stylesheets/extra.css`  
Add custom scripts in `docs/javascripts/extra.js`

These are automatically included via `mkdocs.yml`.

## 🌐 Production Deployment

### GitHub Pages

1. **Enable GitHub Pages** in repository settings
2. **Deploy with mike:**
   ```bash
   mike deploy --push --update-aliases 4.12 latest
   ```

### Custom Server

1. **Build the site:**
   ```bash
   mkdocs build
   ```

2. **Copy `site/` directory** to your web server:
   ```bash
   rsync -av site/ user@server:/var/www/docs/
   ```

3. **Configure Nginx** (already included in `nginx.conf`)

### Container Registry

1. **Tag image:**
   ```bash
   docker tag ta-siemplus-docs:latest registry.example.com/ta-siemplus-docs:latest
   ```

2. **Push to registry:**
   ```bash
   docker push registry.example.com/ta-siemplus-docs:latest
   ```

3. **Deploy on server:**
   ```bash
   docker pull registry.example.com/ta-siemplus-docs:latest
   docker run -d -p 80:80 registry.example.com/ta-siemplus-docs:latest
   ```

## 🔄 Update Workflow

### When Content Changes

1. **Edit markdown files** in appropriate directory
2. **Test locally:**
   ```bash
   mkdocs serve
   ```
3. **Commit and push** to repository
4. **Rebuild Docker image** (if using Docker):
   ```bash
   docker-compose up -d --build
   ```

### When Adding New Runbook/Checklist

1. **Create the markdown file** in appropriate directory
2. **Update navigation** in `mkdocs.yml`
3. **Add to index page** of the section
4. **Test locally** to verify links
5. **Commit and push**

### For New Wazuh Version

1. **Create version directory:**
   ```bash
   mkdir -p docs/upgrade-guides/4.13
   ```

2. **Create version content:**
   ```bash
   cp docs/upgrade-guides/4.12/index.md docs/upgrade-guides/4.13/index.md
   ```

3. **Update content** for new version

4. **Add to navigation** in `mkdocs.yml`

5. **Deploy version:**
   ```bash
   mike deploy 4.13 latest --update-aliases
   ```

## 📊 Monitoring

### Health Checks

The Nginx configuration includes a health endpoint:
```bash
curl http://localhost:8080/health
# Should return: healthy
```

### Docker Health

```bash
docker ps --format "table {{.Names}}\t{{.Status}}"
```

### Logs

```bash
# Docker Compose
docker-compose logs -f docs

# Docker
docker logs -f ta-siemplus-docs

# Nginx access log
docker exec ta-siemplus-docs tail -f /var/log/nginx/access.log

# Nginx error log
docker exec ta-siemplus-docs tail -f /var/log/nginx/error.log
```

## 🔐 Security Considerations

### Content Security

- Never commit secrets to documentation
- Use vault references: `vault://path/to/secret`
- Review all PRs before merging

### Container Security

- Use official base images
- Keep dependencies updated
- Run containers as non-root (Nginx already does this)
- Use read-only filesystem where possible

### Network Security

- Use HTTPS in production (add SSL termination)
- Configure firewall rules
- Consider authentication if needed (use reverse proxy)

## 🛠️ Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
rm -rf site/ .cache/
mkdocs build --strict
```

### Docker Issues

```bash
# Rebuild without cache
docker-compose build --no-cache

# Check container logs
docker-compose logs docs

# Restart container
docker-compose restart docs
```

### Navigation Not Updating

1. Check `mkdocs.yml` syntax
2. Verify file paths are correct
3. Clear browser cache
4. Rebuild site

### Mike Version Issues

```bash
# List deployed versions
mike list

# Rebuild specific version
mike deploy 4.12 --update-aliases

# Force delete and redeploy
mike delete 4.12
mike deploy 4.12 latest
```

## 📝 Best Practices

### Content

- Use meaningful commit messages
- Test all links before committing
- Follow markdown style guide
- Keep content up to date

### Versioning

- Deploy new version for major Wazuh releases
- Keep at least 2 previous versions
- Archive very old versions

### Performance

- Optimize images before adding
- Use lazy loading for large pages
- Monitor site size and build time

### Maintenance

- Review and update quarterly
- Check for broken links monthly
- Update dependencies regularly
- Monitor for security updates

## 📚 Additional Resources

- [MkDocs Documentation](https://www.mkdocs.org/)
- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)
- [Mike Documentation](https://github.com/jimporter/mike)
- [Nginx Documentation](https://nginx.org/en/docs/)
