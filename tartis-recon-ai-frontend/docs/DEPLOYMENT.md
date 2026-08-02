# Shell Deployment

The shell is built as a static Vite application and served by Nginx on port
`80`. The image does not contain a Node.js runtime.

## Required artifacts

The production build must contain:

```text
/usr/share/nginx/html/index.html
/usr/share/nginx/html/assets/remoteEntry.js
```

The shell exposes `AuthProvider` and `keycloak` through Module Federation, so
its `remoteEntry.js` is consumed by the remote microfrontends.

## Build arguments

Remote URLs are embedded into the shell during the Vite build. Local defaults
point to the development ports; the infrastructure deployment must override
them with the Kong paths:

```bash
docker build \
  --build-arg VITE_MFE_ENTRYEXIT_URL=/mfe/entryexit/assets/remoteEntry.js \
  --build-arg VITE_MFE_ADMIN_URL=/mfe/admin/assets/remoteEntry.js \
  -t parking-frontend-shell .
```

The API remains relative to the current origin. Nginx proxies `/v1/*` and
`/v1/events` to Kong, so the browser does not need direct access to backend
microservices.

## Runtime checks

```text
GET /health
GET /index.html
GET /assets/remoteEntry.js
```

`/health` returns `200 ok` and is used by the Docker healthcheck. Kong can use
this endpoint as the upstream health check when the shell is registered as a
static service.

## Kong deployment contract

When Kong serves the shell at `/`, it must proxy the following resources to the
container on port `80`:

```text
/
/index.html
/assets/remoteEntry.js
/health
```

The static route must not require the API JWT plugin. Authentication is handled
by the application and by the protected API routes.
