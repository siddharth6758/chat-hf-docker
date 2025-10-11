FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY model/requirements.txt ./model/requirements.txt
RUN pip install --no-cache-dir -r ./model/requirements.txt

COPY api ./api
COPY model ./model

EXPOSE 8000

CMD ["uvicorn", "api.api:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]