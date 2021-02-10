from django.shortcuts import render
from django.http import HttpResponse
from django.http import FileResponse
from django.http import JsonResponse
from django.shortcuts import render
from django.views.generic import TemplateView
from django.views.decorators.csrf import csrf_exempt
import json


snakeList = []

# Create your views here.
@csrf_exempt
def getHomePage(request):
    if request.method == "GET":
        return render(request, "index.html")
    elif request.method == "POST":
        jsonresponse = {}
        try:
            jsonresponse['yourname'] = json.loads(request.body)['name']
        except Exception as e:
            jsonresponse['error']=str(e)

        strbody = str(request.body.decode('utf-8'))
        if strbody == "I moved":
            print("noti received")
            return HttpResponse("I knowed")

        plcontent = open("files/pl").read()
        jsonresponse['pl'] = plcontent
        return JsonResponse(jsonresponse)

    pass

def getTScript(request):
    return render(request, "tscript.js", content_type="application/x-javascript")
    pass

