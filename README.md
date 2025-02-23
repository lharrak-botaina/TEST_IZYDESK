# TEST_IZYDESK

## Backend Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/lharrak-botaina/TEST_IZYDESK
   ```

2. Navigate to the backend directory:
   ```sh
   cd backend
   ```

3. Install dependencies:
   ```sh
   composer install
   ```

4. Create the database:
   ```sh
   php bin/console doctrine:database:create
   ```

5. Run database migrations:
   ```sh
   php bin/console doctrine:migrations:migrate
   ```

6. Load fixtures (if applicable):
   ```sh
   php bin/console doctrine:fixtures:load
   ```

7. Start the Symfony server:
   ```sh
   symfony serve
   ```

---

## Backoffice Setup

1. Navigate to the backoffice directory:
   ```sh
   cd frontend/backoffice
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm start
   ```

---

## ClientApp Setup

1. Navigate to the client-app directory:
   ```sh
   cd frontend/client-app
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

