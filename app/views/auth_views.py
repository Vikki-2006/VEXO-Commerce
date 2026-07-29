from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

router = APIRouter(tags=["Auth Views"])
templates = Jinja2Templates(directory="app/templates")

@router.get("/auth", response_class=HTMLResponse)
@router.get("/login", response_class=HTMLResponse)
@router.get("/register", response_class=HTMLResponse)
def view_auth(request: Request):
    return templates.TemplateResponse(request=request, name="auth.html")
