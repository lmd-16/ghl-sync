CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    ghl_contact_id VARCHAR(100) UNIQUE,
    mindbody_client_id VARCHAR(100),
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    ghl_contact_id VARCHAR(100),
    amount DECIMAL(10,2),
    transaction_date TIMESTAMP,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sync_log (
    id SERIAL PRIMARY KEY,
    ghl_contact_id VARCHAR(100),
    event_type VARCHAR(50),
    status VARCHAR(20),
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE LTV VIEW client_ltv AS
SELECT 
    ghl_contact_id,
    SUM(amount) as lifetime_value,
    COUNT(*) as transcation_count,
    MIN(transaction_date) as first_transaction,
    MAX(transaction_date) as latest_transaction
FROM transactions
GROUP BY ghl_contact_id;