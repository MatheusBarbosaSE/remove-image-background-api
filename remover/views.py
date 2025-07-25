from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import ImageUploadSerializer

from rembg import remove
from PIL import Image
import io
from django.http import HttpResponse

class RemoveBackgroundView(APIView):
    def post(self, request, format=None):
        serializer = ImageUploadSerializer(data=request.data)

        if serializer.is_valid():
            image_file = serializer.validated_data['image']

            # Open image using Pillow
            input_image = Image.open(image_file)

            # Convert the image to bytes
            image_bytes = io.BytesIO()
            input_image.save(image_bytes, format=input_image.format)
            image_bytes = image_bytes.getvalue()

            # Remove background using rembg
            output_bytes = remove(image_bytes)

            # Return the processed image in the response as PNG
            return HttpResponse(output_bytes, content_type='image/png')

        # Return validation errors if any
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
