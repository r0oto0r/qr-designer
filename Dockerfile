FROM nginx:alpine
LABEL org.opencontainers.image.source=https://github.com/r0oto0r/qr-designer

WORKDIR /opt/page
COPY config/nginx.conf /etc/nginx/nginx.conf
COPY dist/ .

ENV TZ="Europe/Berlin"

STOPSIGNAL SIGQUIT

CMD ["/bin/sh",  "-c",  "exec nginx -g 'daemon off;'"]
