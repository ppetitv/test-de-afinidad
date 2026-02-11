import os
import json

PLANNES = {
    "AHORA NACION - AN": "https://f.rpp-noticias.io/2026/02/09/ahoranacion_1837126.pdf",
    "ALIANZA ELECTORAL VENCEREMOS": "https://f.rpp-noticias.io/2026/02/09/alianza-electoral-venceremos_1837084.pdf",
    "ALIANZA PARA EL PROGRESO": "https://f.rpp-noticias.io/2026/02/09/alianza-para-el-progreso_1837086.pdf",
    "AVANZA PAIS - PARTIDO DE INTEGRACION SOCIAL": "https://f.rpp-noticias.io/2026/02/09/avanza-pais-partido-de-integracion-social_1837087.pdf",
    "FE EN EL PERU": "https://f.rpp-noticias.io/2026/02/09/fe-en-el-peru_1837088.pdf",
    "FUERZA POPULAR": "https://f.rpp-noticias.io/2026/02/09/fuerza-popular_1837089.pdf",
    "FUERZA Y LIBERTAD": "https://f.rpp-noticias.io/2026/02/09/fuerza-y-libertad_1837090.pdf",
    "JUNTOS POR EL PERU": "https://f.rpp-noticias.io/2026/02/09/juntos-por-el-peru_1837091.pdf",
    "LIBERTAD POPULAR": "https://f.rpp-noticias.io/2026/02/09/libertad-popular_1837092.pdf",
    "PARTIDO APRISTA PERUANO": "https://f.rpp-noticias.io/2026/02/09/partido-aprista-peruano_1837093.pdf",
    "PARTIDO CIVICO OBRAS": "https://f.rpp-noticias.io/2026/02/09/partido-civico-obras_1837094.pdf",
    "PARTIDO DE LOS TRABAJADORES Y EMPRENDEDORES PTE - PERU": "https://f.rpp-noticias.io/2026/02/09/partido-de-los-trabajadores-y-emprendedores-pte-peru_1837095.pdf",
    "PARTIDO DEL BUEN GOBIERNO": "https://f.rpp-noticias.io/2026/02/09/partido-del-buen-gobierno_1837096.pdf",
    "PARTIDO DEMOCRATA UNIDO PERU": "https://f.rpp-noticias.io/2026/02/09/partido-democrata-unido-peru_1837098.pdf",
    "PARTIDO DEMOCRATA VERDE": "https://f.rpp-noticias.io/2026/02/09/partido-democrata-verde_1837100.pdf",
    "PARTIDO DEMOCRATICO FEDERAL": "https://f.rpp-noticias.io/2026/02/09/partido-democratico-federal_1837121.pdf",
    "PARTIDO DEMOCRATICO SOMOS PERU": "https://f.rpp-noticias.io/2026/02/09/partido-democratico-somos-peru_1837101.pdf",
    "PARTIDO FRENTE DE LA ESPERANZA 2021": "https://f.rpp-noticias.io/2026/02/09/partido-frente-de-la-esperanza-2021_1837102.pdf",
    "PARTIDO MORADO": "https://f.rpp-noticias.io/2026/02/09/partido-morado_1837103.pdf",
    "PARTIDO PAIS PARA TODOS": "https://f.rpp-noticias.io/2026/02/09/partido-pais-para-todos_1837104.pdf",
    "PARTIDO PATRIOTICO DEL PERU": "https://f.rpp-noticias.io/2026/02/09/partido-patriotico-del-peru_1837105.pdf",
    "PARTIDO POLITICO COOPERACION POPULAR": "https://f.rpp-noticias.io/2026/02/09/partido-politico-cooperacion-popular_1837106.pdf",
    "PARTIDO POLITICO INTEGRIDAD DEMOCRATICA": "https://f.rpp-noticias.io/2026/02/09/partido-politico-integridad-democratica_1837107.pdf",
    "PARTIDO POLITICO NACIONAL PERU LIBRE": "https://f.rpp-noticias.io/2026/02/09/partido-politico-nacional-peru-libre_1837108.pdf",
    "PARTIDO POLITICO PERU ACCION": "https://f.rpp-noticias.io/2026/02/09/partido-politico-peru-accion_1837109.pdf",
    "PARTIDO POLITICO PERU PRIMERO": "https://f.rpp-noticias.io/2026/02/09/partido-politico-peru-primero_1837110.pdf",
    "PARTIDO POLITICO PRIN": "https://f.rpp-noticias.io/2026/02/09/partido-politico-prin_1837111.pdf",
    "PARTIDO SICREO": "https://f.rpp-noticias.io/2026/02/09/partido-sicreo_1837112.pdf",
    "PERU MODERNO": "https://f.rpp-noticias.io/2026/02/09/peru-moderno_1837113.pdf",
    "PODEMOS PERU": "https://f.rpp-noticias.io/2026/02/09/podemos-peru_1837114.pdf",
    "PRIMERO LA GENTE - COMUNIDAD, ECOLOGIA, LIBERTAD Y PROGRESO": "https://f.rpp-noticias.io/2026/02/09/primero-la-gente-comunidad-ecologia-libertad-y-progreso_1837115.pdf",
    "PROGRESEMOS": "https://f.rpp-noticias.io/2026/02/09/progresemos_1837116.pdf",
    "RENOVACION POPULAR": "https://f.rpp-noticias.io/2026/02/09/renovacion-popular_1837117.pdf",
    "SALVEMOS AL PERU": "https://f.rpp-noticias.io/2026/02/09/salvemos-al-peru_1837118.pdf",
    "UN CAMINO DIFERENTE": "https://f.rpp-noticias.io/2026/02/09/un-camino-diferente_1837119.pdf",
    "UNIDAD NACIONAL": "https://f.rpp-noticias.io/2026/02/09/unidad-nacional_1837120.pdf"
}

def read_proposals():
    folder_path = 'data/proposals'
    invalid_parties = set() # Usamos un set para no repetir el mismo error muchas veces

    if os.path.exists(folder_path):
        for filename in os.listdir(folder_path):
            if filename.endswith('.json'):
                file_path = os.path.join(folder_path, filename)
                
                with open(file_path, 'r', encoding='utf-8') as file:
                    try:
                        data = json.load(file)
                        # Normalizamos la data a una lista para procesar igual ambos casos
                        items = data if isinstance(data, list) else [data]
                        
                        for item in items:
                            matches = item.get('matches', [])
                            for match in matches:
                                partido_nombre = match.get('partido', '').strip()
                                
                                # Verificación de Key válida
                                if partido_nombre not in PLANNES:
                                    invalid_parties.add(partido_nombre)
                                
                    except json.JSONDecodeError:
                        print(f"Error: JSON inválido en {filename}")
        
        # Reporte de resultados
        if invalid_parties:
            print("--- PARTIDOS NO ENCONTRADOS EN PLANNES ---")
            for p in sorted(invalid_parties):
                print(f"'{p}'")
        else:
            print("Todos los partidos coinciden con las llaves de PLANNES.")
    else:
        print(f"La ruta {folder_path} no existe.")

if __name__ == "__main__":
    read_proposals()