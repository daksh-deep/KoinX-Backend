# KoinX Backend

A robust Node.js application that tracks cryptocurrency prices and provides statistical analysis through a REST API. The application fetches data from CoinGecko API for Bitcoin, Ethereum, and Polygon (MATIC), stores it in MongoDB, and provides endpoints for price statistics and deviation analysis.

## Features

- Real-time cryptocurrency price tracking
- Price statistics endpoint (`/api/stats`)
- Price deviation analysis endpoint (`/api/deviation`)
- Automated data collection job
- Comprehensive error handling and logging
- MongoDB integration for data persistence

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- Node-fetch for API requests
- Dotenv for environment variables

## Prerequisites

- Node.js (v14 or higher)
- MongoDB instance
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/daksh-deep/KoinX-Backend
cd KoinX-Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=5000
DATABASE_URL = <your-connection-string>
LOG_FILE = ./logs/app.log
JOB_LOG_FILE = ./logs/job_logs.log
```

4. Create the logs directory:
```bash
mkdir logs
```

## Usage

### Starting the API Server

```bash
npm start
```

The server will start on the specified PORT (default: 3000)

### Running the Data Collection Job Manually

```bash
npm run job
```

### Development Mode

```bash
npm run dev
```

## API Endpoints

### GET /api/stats
Fetches current price statistics for a specified cryptocurrency.

**Request Body:**
```json
{
    "coin": "bitcoin"
}
```

**Response:**
```json
{
  "price": 94542,
  "market_cap": 1873237105369,
  "24hChange": 3523
}
```

### GET /api/deviation
Calculates price deviation based on historical data.

**Request Body:**
```json
{
    "coin": "bitcoin"
}
```

**Response:**
```json
{
    "deviation": "4082.48"
}
```

## Supported Cryptocurrencies

- Bitcoin (`bitcoin`)
- Ethereum (`ethereum`)
- Polygon (`matic-network`)

## Setting up GitHub Actions for Automated Data Collection

To keep your database updated with the latest cryptocurrency prices, you can set up a GitHub Action to run the data collection job every hour. Create a new file `.github/workflows/cron-job.yml` with the following content:

```yaml
name: Hourly Data Collection

on:
  schedule:
    - cron: '0 * * * *'  # Runs every hour
  workflow_dispatch:      # Allows manual trigger

jobs:
  collect-data:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
        
    - name: Run data collection job
      run: node job.js
      env:
        DATABASE_URL: ${{ secrets.DATABASE_URL }}
        JOB_LOG_FILE: ./logs/job_logs.log
```

> [!IMPORTANT]
> 1. Add your `DATABASE_URL` to your repository secrets in GitHub
> 2. Enable GitHub Actions in your repository settings
> 3. Ensure your MongoDB instance is accessible from GitHub Actions

## Error Handling

The application implements comprehensive error handling:
- API request failures
- Database connection issues
- Invalid input validation
- Runtime exceptions

All errors are logged to the specified log files with timestamps and error levels.

## Logging

Logs are stored in the `logs` directory:
- `app.log`: General application logs
- `job_logs.log`: Data collection job specific logs

Each log entry includes:
- Timestamp
- Log level (INFO, ERROR, WARN)
- Detailed message

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
