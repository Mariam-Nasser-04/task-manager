import os
from flask import Flask, render_template, redirect, url_for, request, session, flash
from models import db, User, Task
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your_secret_key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///instance/data.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/')
def index():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    user = User.query.get(session['user_id'])
    if not user:
        return redirect(url_for('login'))
    tasks = Task.query.filter_by(user_id=user.id).all()
    return render_template('index.html', user=user, tasks=tasks)

# في app.py
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '').strip()
        
        if not username or not password:
            flash('Please fill in all fields', 'error')
            return render_template('login.html', username=username)
            
        user = User.query.filter_by(username=username).first()
        
        if not user:
            flash('Username not found', 'error')
            return render_template('login.html', username=username)
            
        if not check_password_hash(user.password, password):
            flash('Incorrect password', 'error')
            return render_template('login.html', username=username)
            
        session['user_id'] = user.id
        flash('Login successful!', 'success')
        return redirect(url_for('index'))
        
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '').strip()
        
        if not username or not password:
            flash('Please fill in all fields', 'error')
            return render_template('register.html', username=username)
            
        if len(username) < 3:
            flash('Username must be at least 3 characters', 'error')
            return render_template('register.html', username=username)
            
        if len(password) < 6:
            flash('Password must be at least 6 characters', 'error')
            return render_template('register.html', username=username)
            
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            flash('Username already taken', 'error')
            return render_template('register.html', username=username)
            
        hashed_password = generate_password_hash(password)
        new_user = User(username=username, password=hashed_password)
        
        try:
            db.session.add(new_user)
            db.session.commit()
            flash('Registration successful! Please log in.', 'success')
            return redirect(url_for('login'))
        except:
            db.session.rollback()
            flash('An error occurred during registration', 'error')
            return render_template('register.html', username=username)
    
    return render_template('register.html')

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect(url_for('login'))

@app.route('/add', methods=['POST'])
def add_task():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    content = request.form['content']
    new_task = Task(content=content, user_id=session['user_id'])
    db.session.add(new_task)
    db.session.commit()
    return redirect(url_for('index'))

@app.route('/complete/<int:task_id>')
def complete_task(task_id):
    task = Task.query.get(task_id)
    if task and task.user_id == session['user_id']:
        task.is_done = True
        db.session.commit()
    return redirect(url_for('index'))

@app.route('/delete/<int:task_id>')
def delete_task(task_id):
    if 'user_id' not in session:
        return redirect(url_for('login'))
    task = Task.query.get(task_id)
    if task and task.user_id == session['user_id']:
        db.session.delete(task)
        db.session.commit()
        flash('Task deleted successfully')
    return redirect(url_for('index'))

@app.route('/incomplete/<int:task_id>')
def incomplete_task(task_id):
    if 'user_id' not in session:
        return redirect(url_for('login'))
    task = Task.query.get(task_id)
    if task and task.user_id == session['user_id']:
        task.is_done = False
        db.session.commit()
        flash('Task marked as incomplete')
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')