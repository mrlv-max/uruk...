import plotly.graph_objects as go
import plotly.express as px
import numpy as np

# Define the architecture components with better positioning and clearer names
components = {
    # API Gateway Layer (top)
    'Nginx Load Balancer': {'x': 0, 'y': 6, 'layer': 'API Gateway', 'color': '#1FB8CD', 'size': 35},
    
    # Microservices Layer (arranged in two rows for better spacing)
    'User Mgmt\n(3001)': {'x': -4, 'y': 5, 'layer': 'Microservices', 'color': '#DB4545', 'size': 30},
    'Health Mon\n(3002)': {'x': -2.4, 'y': 5, 'layer': 'Microservices', 'color': '#DB4545', 'size': 30},
    'Ambulance\n(3003)': {'x': -0.8, 'y': 5, 'layer': 'Microservices', 'color': '#DB4545', 'size': 30},
    'Medical Rec\n(3004)': {'x': 0.8, 'y': 5, 'layer': 'Microservices', 'color': '#DB4545', 'size': 30},
    'Pharmacy\n(3005)': {'x': 2.4, 'y': 5, 'layer': 'Microservices', 'color': '#DB4545', 'size': 30},
    'AI Assistant\n(3006)': {'x': -3.2, 'y': 4.2, 'layer': 'Microservices', 'color': '#DB4545', 'size': 30},
    'Appointments\n(3007)': {'x': -1.6, 'y': 4.2, 'layer': 'Microservices', 'color': '#DB4545', 'size': 30},
    'Notifications\n(3008)': {'x': 0, 'y': 4.2, 'layer': 'Microservices', 'color': '#DB4545', 'size': 30},
    'Payments\n(3009)': {'x': 1.6, 'y': 4.2, 'layer': 'Microservices', 'color': '#DB4545', 'size': 30},
    'Analytics\n(3010)': {'x': 3.2, 'y': 4.2, 'layer': 'Microservices', 'color': '#DB4545', 'size': 30},
    
    # Database Layer
    'PostgreSQL\n(Primary)': {'x': -2.5, 'y': 3, 'layer': 'Databases', 'color': '#2E8B57', 'size': 32},
    'Redis\n(Cache)': {'x': -0.8, 'y': 3, 'layer': 'Databases', 'color': '#2E8B57', 'size': 32},
    'MongoDB\n(Documents)': {'x': 0.8, 'y': 3, 'layer': 'Databases', 'color': '#2E8B57', 'size': 32},
    'InfluxDB\n(Time-series)': {'x': 2.5, 'y': 3, 'layer': 'Databases', 'color': '#2E8B57', 'size': 32},
    
    # Storage & Blockchain Layer
    'IPFS\n(Files)': {'x': -1.5, 'y': 1.8, 'layer': 'Storage', 'color': '#5D878F', 'size': 30},
    'Ganache\n(Blockchain)': {'x': 1.5, 'y': 1.8, 'layer': 'Storage', 'color': '#5D878F', 'size': 30},
    
    # Message Queue Layer
    'Apache Kafka': {'x': -2, 'y': 0.6, 'layer': 'Message Queue', 'color': '#D2BA4C', 'size': 30},
    'Zookeeper': {'x': 0, 'y': 0.6, 'layer': 'Message Queue', 'color': '#D2BA4C', 'size': 30},
    
    # Monitoring Layer
    'Prometheus': {'x': 1, 'y': 0.6, 'layer': 'Monitoring', 'color': '#B4413C', 'size': 28},
    'Grafana': {'x': 2.5, 'y': 0.6, 'layer': 'Monitoring', 'color': '#B4413C', 'size': 28},
    'Elasticsearch': {'x': 4, 'y': 0.6, 'layer': 'Monitoring', 'color': '#B4413C', 'size': 28},
    'Kibana': {'x': 5.5, 'y': 0.6, 'layer': 'Monitoring', 'color': '#B4413C', 'size': 28},
}

# Define connections with different types
connections = {
    'api_gateway': [
        ('Nginx Load Balancer', 'User Mgmt\n(3001)'),
        ('Nginx Load Balancer', 'Health Mon\n(3002)'),
        ('Nginx Load Balancer', 'Ambulance\n(3003)'),
        ('Nginx Load Balancer', 'Medical Rec\n(3004)'),
        ('Nginx Load Balancer', 'Pharmacy\n(3005)'),
        ('Nginx Load Balancer', 'AI Assistant\n(3006)'),
        ('Nginx Load Balancer', 'Appointments\n(3007)'),
        ('Nginx Load Balancer', 'Notifications\n(3008)'),
        ('Nginx Load Balancer', 'Payments\n(3009)'),
        ('Nginx Load Balancer', 'Analytics\n(3010)')
    ],
    'database': [
        ('User Mgmt\n(3001)', 'PostgreSQL\n(Primary)'),
        ('Health Mon\n(3002)', 'PostgreSQL\n(Primary)'),
        ('Ambulance\n(3003)', 'PostgreSQL\n(Primary)'),
        ('Medical Rec\n(3004)', 'PostgreSQL\n(Primary)'),
        ('Pharmacy\n(3005)', 'PostgreSQL\n(Primary)'),
        ('Appointments\n(3007)', 'PostgreSQL\n(Primary)'),
        ('Notifications\n(3008)', 'PostgreSQL\n(Primary)'),
        ('Payments\n(3009)', 'PostgreSQL\n(Primary)'),
        ('Analytics\n(3010)', 'PostgreSQL\n(Primary)'),
        ('User Mgmt\n(3001)', 'Redis\n(Cache)'),
        ('Health Mon\n(3002)', 'Redis\n(Cache)'),
        ('Appointments\n(3007)', 'Redis\n(Cache)'),
        ('Medical Rec\n(3004)', 'MongoDB\n(Documents)'),
        ('AI Assistant\n(3006)', 'MongoDB\n(Documents)'),
        ('Health Mon\n(3002)', 'InfluxDB\n(Time-series)'),
        ('Analytics\n(3010)', 'InfluxDB\n(Time-series)')
    ],
    'storage': [
        ('Medical Rec\n(3004)', 'IPFS\n(Files)'),
        ('AI Assistant\n(3006)', 'IPFS\n(Files)'),
        ('Medical Rec\n(3004)', 'Ganache\n(Blockchain)')
    ],
    'messaging': [
        ('Health Mon\n(3002)', 'Apache Kafka'),
        ('Ambulance\n(3003)', 'Apache Kafka'),
        ('Notifications\n(3008)', 'Apache Kafka'),
        ('Analytics\n(3010)', 'Apache Kafka'),
        ('Apache Kafka', 'Zookeeper')
    ],
    'monitoring': [
        ('Prometheus', 'Grafana'),
        ('Elasticsearch', 'Kibana')
    ]
}

# Create the figure
fig = go.Figure()

# Add enhanced layer background rectangles with better visibility
layer_backgrounds = {
    'API Gateway': {'y': 6, 'height': 0.5, 'color': 'rgba(31,184,205,0.15)', 'name': 'API Gateway'},
    'Microservices': {'y': 4.6, 'height': 1.2, 'color': 'rgba(219,69,69,0.15)', 'name': 'Microservices Layer'},
    'Databases': {'y': 3, 'height': 0.5, 'color': 'rgba(46,139,87,0.15)', 'name': 'Database Layer'},
    'Storage': {'y': 1.8, 'height': 0.5, 'color': 'rgba(93,135,143,0.15)', 'name': 'Storage & Blockchain'},
    'Infrastructure': {'y': 0.6, 'height': 0.5, 'color': 'rgba(210,186,76,0.15)', 'name': 'Message Queue & Monitoring'}
}

for layer, props in layer_backgrounds.items():
    fig.add_shape(
        type="rect",
        x0=-5, x1=6.5,
        y0=props['y']-props['height']/2, y1=props['y']+props['height']/2,
        fillcolor=props['color'],
        line=dict(width=1, color='rgba(0,0,0,0.1)'),
        layer="below"
    )

# Add connections with different styles based on type
connection_styles = {
    'api_gateway': {'width': 2, 'color': 'rgba(31,184,205,0.6)'},
    'database': {'width': 1.5, 'color': 'rgba(46,139,87,0.6)'},
    'storage': {'width': 2, 'color': 'rgba(93,135,143,0.8)'},
    'messaging': {'width': 2, 'color': 'rgba(210,186,76,0.8)'},
    'monitoring': {'width': 1.5, 'color': 'rgba(180,65,60,0.6)', 'dash': 'dot'}
}

for conn_type, conn_list in connections.items():
    style = connection_styles[conn_type]
    for start, end in conn_list:
        if start in components and end in components:
            start_pos = components[start]
            end_pos = components[end]
            
            line_dict = {'width': style['width'], 'color': style['color']}
            if 'dash' in style:
                line_dict['dash'] = style['dash']
            
            fig.add_trace(go.Scatter(
                x=[start_pos['x'], end_pos['x']],
                y=[start_pos['y'], end_pos['y']],
                mode='lines',
                line=line_dict,
                showlegend=False,
                hoverinfo='skip'
            ))

# Add components as scatter points with improved labels
for component, props in components.items():
    fig.add_trace(go.Scatter(
        x=[props['x']],
        y=[props['y']],
        mode='markers+text',
        marker=dict(
            size=props['size'],
            color=props['color'],
            line=dict(width=3, color='white')
        ),
        text=[component],
        textposition='middle center',
        textfont=dict(size=10, color='white', family='Arial Black'),
        showlegend=False,
        hovertemplate=f'<b>{component.replace(chr(10), " ")}</b><br>Layer: {props["layer"]}<extra></extra>'
    ))

# Add layer labels with better positioning
layer_labels = [
    {'text': 'API Gateway', 'y': 6, 'color': '#1FB8CD'},
    {'text': 'Microservices', 'y': 4.6, 'color': '#DB4545'},
    {'text': 'Databases', 'y': 3, 'color': '#2E8B57'},
    {'text': 'Storage & Chain', 'y': 1.8, 'color': '#5D878F'},
    {'text': 'Queue & Monitor', 'y': 0.6, 'color': '#B4413C'}
]

for label in layer_labels:
    fig.add_annotation(
        x=-5.5,
        y=label['y'],
        text=f'<b>{label["text"]}</b>',
        showarrow=False,
        font=dict(size=12, color=label['color']),
        xanchor='right'
    )

# Update layout with improved styling
fig.update_layout(
    title=dict(
        text='Uruk Health Backend Architecture',
        x=0.5,
        font=dict(size=20, color='#1FB8CD')
    ),
    xaxis=dict(
        range=[-6, 7],
        showgrid=False,
        showticklabels=False,
        zeroline=False
    ),
    yaxis=dict(
        range=[0, 6.5],
        showgrid=False,
        showticklabels=False,
        zeroline=False
    ),
    plot_bgcolor='white',
    showlegend=False,
    font=dict(size=10),
    annotations=[
        dict(
            x=0.5, y=6.8,
            text='<i>Comprehensive Microservices System Design</i>',
            showarrow=False,
            font=dict(size=14, color='#666'),
            xanchor='center'
        )
    ]
)

# Save the chart
fig.write_image('uruk_health_architecture.png')
fig.write_image('uruk_health_architecture.svg', format='svg')

print("Enhanced architecture diagram created successfully!")