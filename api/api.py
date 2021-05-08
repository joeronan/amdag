from datetime import datetime
from flask import Flask, request, redirect, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Task {self.id}>'


@app.route('/todo', methods=['POST', 'GET', 'DELETE'])
def index():
    if request.method == 'POST':
        task_dict = request.get_json()
        task = Todo(content=task_dict['content'])

        try:
            db.session.add(task)
            db.session.commit()
            return 'Done', 201
        except:
            return 'There was an issue with your post task'

    elif request.method == 'GET':
        task_list = Todo.query.order_by(Todo.date_created).all()
        tasks = []
        for task in task_list:
            tasks.append({
                'id': task.id,
                'content': task.content,
                'date_created': task.date_created
            })

        return jsonify({'tasks': tasks})

    elif request.method == 'DELETE':
        task_dict = request.get_json()
        task = Todo.query.get(task_dict['id'])

        try:
            db.session.delete(task)
            db.session.commit()
            return 'Done', 201
        except:
            return 'There was an issue with your delete task'
