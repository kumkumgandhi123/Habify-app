import os
from django.conf import settings
from django.http import HttpResponse, Http404
from django.views.generic import View


class ReactAppView(View):
    """
    Serves the React app for all non-API routes.
    This allows React Router to handle client-side routing.
    """
    
    def get(self, request, *args, **kwargs):
        try:
            # Path to the React build index.html
            index_path = os.path.join(settings.BASE_DIR, 'interface', 'build', 'index.html')
            
            with open(index_path, 'r', encoding='utf-8') as file:
                return HttpResponse(file.read(), content_type='text/html')
                
        except FileNotFoundError:
            # Fallback for development or if build doesn't exist
            return HttpResponse(
                """
                <html>
                    <body>
                        <h1>React Build Not Found</h1>
                        <p>Please run: <code>cd interface && npm run build</code></p>
                        <p>Then restart the Django server.</p>
                    </body>
                </html>
                """,
                content_type='text/html'
            )
