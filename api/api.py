from datetime import datetime
from flask import Flask, request, redirect, jsonify
from flask_sqlalchemy import SQLAlchemy

# Setting up the database

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///amdag.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

adjacency = db.Table(
    'adjacency',
    db.Column('parent_id', db.Integer, db.ForeignKey('element.id')),
    db.Column('child_id', db.Integer, db.ForeignKey('element.id')),
)


class Element(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    header = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    date_edited = db.Column(db.DateTime, default=datetime.utcnow)
    x = db.Column(db.Integer, default=0)
    y = db.Column(db.Integer, default=0)
    children = db.relationship('Element',
                               secondary=adjacency,
                               primaryjoin=id == adjacency.c.parent_id,
                               secondaryjoin=id == adjacency.c.child_id,
                               backref=db.backref('parents'))

    def __repr__(self):
        return f'<Element {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'header': self.header,
            'content': self.content,
            'date_created': self.date_created,
            'date_edited': self.date_edited,
            'parents': [x.id for x in self.parents],
            'x': self.x,
            'y': self.y,
            'children': [x.id for x in self.children],
        }


# Helper functions for dealing with graphs


def _get_upper_interval(element: Element, upper_interval: list):
    for parent in element.parents:
        if parent not in upper_interval:
            upper_interval.append(parent)
            upper_interval = _get_upper_interval(parent, upper_interval)

    return upper_interval


def get_upper_interval(element: Element):
    return _get_upper_interval(element, [])


def _get_lower_interval(element: Element, lower_interval: list):
    for child in element.children:
        if child not in lower_interval:
            lower_interval.append(child)
            lower_interval = _get_lower_interval(child, lower_interval)

    return lower_interval


def get_lower_interval(element: Element):
    return _get_lower_interval(element, [])


# API request handlers


@app.route('/element', methods=['POST', 'PUT', 'GET', 'DELETE'])
def element_handler():
    if request.method == 'POST':
        element_dict = request.get_json()
        element = Element(header=element_dict['header'],
                          content=element_dict['content'],
                          x=element_dict['x'],
                          y=element_dict['y'])

        for parent in element_dict.get('parents', []):
            element.parents.append(Element.query.get(parent))
        for child in element_dict.get('children', []):
            element.parents.append(Element.query.get(child))

        try:
            db.session.add(element)
            db.session.commit()
            return jsonify({'id': element.id}), 201
        except:
            return 'There was an issue with your post task'

    elif request.method == 'PUT':
        element_dict = request.get_json()
        element = Element.query.get(element_dict['id'])

        print(element.header)

        element.header = element_dict.get('header', element.header)
        element.content = element_dict.get('content', element.content)
        element.x = element_dict.get('x', element.x)
        element.y = element_dict.get('y', element.y)

        for parent in element_dict.get('parents', []):
            if parent not in [x.id for x in element.parents]:
                element.parents.append(Element.query.get(parent))
        for child in element_dict.get('children', []):
            if child not in [x.id for x in element.children]:
                element.children.append(Element.query.get(child))

        element.edited = datetime.utcnow

        try:
            db.session.commit()
            return 'Done', 201
        except:
            return 'There was an issue with your post task'

    elif request.method == 'GET':
        element = Element.query.get(request.args.get('id'))

        return jsonify(element.to_dict())

    elif request.method == 'DELETE':
        element_dict = request.get_json()
        element = Element.query.get(element_dict['id'])

        try:
            db.session.delete(element)
            db.session.commit()
            return 'Done', 201
        except:
            return 'There was an issue with deleting your element'


@app.route('/subgraph', methods=['GET'])
def subgraph_handler():
    if request.method == 'GET':
        subgraph_type = request.args.get('type')
        element = Element.query.get(request.args.get('id'))

        if subgraph_type == 'upper':
            subgraph = get_upper_interval(element)
        elif subgraph_type == 'lower':
            subgraph = get_lower_interval(element)
        else:
            return 'Invalid subgraph type'

        return jsonify({'elements': [x.to_dict() for x in subgraph]})


@app.route('/graph', methods=['GET'])
def graph_handler():
    if request.method == 'GET':
        graph = Element.query.order_by(Element.id).all()

        return jsonify({'elements': [x.to_dict() for x in graph]})