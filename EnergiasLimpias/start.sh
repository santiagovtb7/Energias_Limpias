#!/bin/bash

echo "🌱 Iniciando EcoEnergía Colombia..."
echo "=================================="

# Verificar si el entorno virtual existe
if [ ! -d "venv" ]; then
    echo "📦 Creando entorno virtual..."
    python3 -m venv venv
fi

# Activar entorno virtual
echo "🔌 Activando entorno virtual..."
source venv/bin/activate

# Instalar dependencias si no están instaladas
echo "📚 Instalando dependencias..."
pip install -r requirements.txt

# Ejecutar la aplicación
echo "🚀 Iniciando servidor Flask..."
echo "📍 La aplicación estará disponible en: http://localhost:5000"
echo "⚠️  Presiona Ctrl+C para detener el servidor"
echo ""

python app.py