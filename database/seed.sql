INSERT INTO users (name, email, password, role)
VALUES ('Admin User', 'admin@example.com', 'password123', 'ADMIN');

INSERT INTO users (name, email, password, role)
VALUES ('Raghav Demo', 'raghav@example.com', 'password123', 'USER');

INSERT INTO events (title, description, category, venue, event_date, capacity, price, status)
VALUES (
    'Build Night',
    'A practical evening for students to build small software and hardware projects.',
    'TECH',
    'Innovation Lab',
    TIMESTAMP '2026-10-05 17:30:00',
    120,
    0,
    'OPEN'
);

INSERT INTO events (title, description, category, venue, event_date, capacity, price, status)
VALUES (
    'AI Systems Workshop',
    'Hands-on introduction to neural networks, APIs and deployment.',
    'AI',
    'Seminar Hall 2',
    TIMESTAMP '2026-10-12 10:00:00',
    80,
    199,
    'OPEN'
);

INSERT INTO events (title, description, category, venue, event_date, capacity, price, status)
VALUES (
    'Hackathon 2026',
    'A 24-hour student hackathon focused on practical engineering problems.',
    'HACKATHON',
    'Main Auditorium',
    TIMESTAMP '2026-11-01 09:00:00',
    300,
    299,
    'OPEN'
);

INSERT INTO events (title, description, category, venue, event_date, capacity, price, status)
VALUES (
    'Design Systems Meetup',
    'A compact meetup about interface systems, typography and product design.',
    'DESIGN',
    'Design Studio',
    TIMESTAMP '2026-11-14 15:00:00',
    60,
    99,
    'OPEN'
);

COMMIT;
