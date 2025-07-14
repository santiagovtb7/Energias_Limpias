from flask import Flask, render_template, jsonify
import json

app = Flask(__name__)

# Datos sobre energías limpias en Colombia
clean_energy_data = {
    "statistics": {
        "hydroelectric": {"percentage": 68, "capacity": "17,500 MW", "color": "#2563eb"},
        "thermal": {"percentage": 29, "capacity": "7,400 MW", "color": "#dc2626"},
        "solar": {"percentage": 1.5, "capacity": "400 MW", "color": "#f59e0b"},
        "wind": {"percentage": 1.5, "capacity": "380 MW", "color": "#10b981"}
    },
    "projects": [
        {
            "name": "Parque Eólico Guajira I",
            "type": "Eólica",
            "capacity": "20 MW",
            "location": "La Guajira",
            "status": "Operativo",
            "description": "Primer parque eólico comercial de Colombia"
        },
        {
            "name": "Granja Solar El Paso",
            "type": "Solar",
            "capacity": "86.2 MW",
            "location": "Cesar",
            "status": "Operativo",
            "description": "Una de las granjas solares más grandes del país"
        },
        {
            "name": "Central Hidroeléctrica Ituango",
            "type": "Hidroeléctrica",
            "capacity": "2,400 MW",
            "location": "Antioquia",
            "status": "En construcción",
            "description": "Será la central hidroeléctrica más grande de Colombia"
        },
        {
            "name": "Parque Solar Bayunca",
            "type": "Solar",
            "capacity": "61.3 MW",
            "location": "Bolívar",
            "status": "Operativo",
            "description": "Importante proyecto solar en la costa Caribe"
        }
    ],
    "regions": [
        {
            "name": "Costa Caribe",
            "potential": "Excelente para energía solar y eólica",
            "projects": 15,
            "highlight": "Alta radiación solar y vientos constantes"
        },
        {
            "name": "Región Andina",
            "potential": "Ideal para hidroeléctrica y solar",
            "projects": 32,
            "highlight": "Recursos hídricos abundantes"
        },
        {
            "name": "Región Pacífica",
            "potential": "Gran potencial hidroeléctrico",
            "projects": 8,
            "highlight": "Altos niveles de precipitación"
        },
        {
            "name": "Orinoquia",
            "potential": "Emergente en energía solar",
            "projects": 5,
            "highlight": "Territorio extenso con buena radiación"
        }
    ]
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/statistics')
def get_statistics():
    return jsonify(clean_energy_data["statistics"])

@app.route('/api/projects')
def get_projects():
    return jsonify(clean_energy_data["projects"])

@app.route('/api/regions')
def get_regions():
    return jsonify(clean_energy_data["regions"])

@app.route('/api/all-data')
def get_all_data():
    return jsonify(clean_energy_data)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)