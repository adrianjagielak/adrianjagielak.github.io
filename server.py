#!/usr/bin/env python3

# https://gist.github.com/iktakahiro/2c48962561ea724f1e9d
# Python3 http.server for Single Page Application

import urllib.parse
import http.server
import socketserver
import re
import sys
from pathlib import Path

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
HOST = ('0.0.0.0', PORT)
pattern = re.compile('.png|.jpg|.jpeg|.js|.css|.ico|.gif|.svg', re.IGNORECASE)


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        url_parts = urllib.parse.urlparse(self.path)
        request_file_path = Path(url_parts.path.strip("/"))

        ext = request_file_path.suffix
        if not request_file_path.is_file() and not pattern.match(ext):
            self.path = 'index.html'

        return http.server.SimpleHTTPRequestHandler.do_GET(self)


httpd = socketserver.TCPServer(HOST, Handler)
print(f"Serving HTTP on :: port {PORT} (http://[::]:{PORT}/) ...")
httpd.serve_forever()
