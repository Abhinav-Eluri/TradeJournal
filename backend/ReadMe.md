# Stock Trading Platform

A Django-based platform for managing stock trading, including features like user deposits, stock orders, open positions, and completed trades.

## Features

- **User Authentication**: Secure login and registration.
- **Password Reset**: OTP-based password reset functionality.
- **Deposits**: Manage user deposits and balances.
- **Stock Orders**: Create and manage stock orders.
- **Open Positions**: Track open stock positions.
- **Completed Trades**: View and manage closed trades with profit/loss calculations.

## Prerequisites

Ensure you have the following installed:

- Python 3.8+
- Django 4.x
- pip (Python package manager)

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
    ```
2. Create a virtual environment:
3. ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
4. Install the required packages:
   ```bash
    pip install -r requirements.txt
    ```
5. Set up the database:
6. ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
   
7. Create a superuser:
   ```bash
    python manage.py createsuperuser
    ```
   
8. Run the development server from the location where manage.py is located:
9. ```bash
   python manage.py runserver
   ```
   
