<?php

$img = static fn (string $path): string =>
    "https://images.unsplash.com/{$path}?auto=format&fit=crop&w=1200&q=80";

return [
    'projects' => [
        [
            'id' => 'p1', 'slug' => 'alpine-logistics-platform', 'title' => 'Alpine Logistics Platform',
            'client_name' => 'NorthPeak Freight', 'category' => 'SaaS',
            'excerpt' => 'Unified dispatch and tracking for regional freight operators.',
            'cover_image' => $img('photo-1586528116311-ad8dd3c8310d'), 'cover_image_alt' => 'Alpine Logistics Platform',
            'problem' => 'Manual dispatch spreadsheets caused missed loads and poor visibility for drivers in remote valleys.',
            'solution' => 'We built a cloud-native SaaS with real-time GPS tracking, automated routing, and offline-first mobile apps for drivers.',
            'result' => 'Dispatch time dropped 62% and on-time delivery improved to 97% within three months of launch.',
            'metrics' => [['label' => 'Dispatch time', 'value' => '-62%'], ['label' => 'On-time delivery', 'value' => '97%']],
            'tech_stack' => ['Next.js', 'PostgreSQL', 'React Native', 'AWS'], 'featured' => true,
        ],
        [
            'id' => 'p2', 'slug' => 'heritage-tourism-booking', 'title' => 'Heritage Tourism Booking',
            'client_name' => 'Silk Route Experiences', 'category' => 'Web',
            'excerpt' => 'Direct booking engine replacing third-party OTAs.',
            'cover_image' => $img('photo-1469854523086-bd94bbe22747'), 'cover_image_alt' => 'Heritage Tourism Booking',
            'problem' => 'High OTA commissions and no control over guest experience on mobile networks.',
            'solution' => 'Custom booking site with multi-currency payments, itinerary builder, and CMS-managed content.',
            'result' => 'Direct bookings grew 4× and average order value increased 28% in the first season.',
            'metrics' => [['label' => 'Direct bookings', 'value' => '4×']],
            'tech_stack' => ['Next.js', 'Stripe', 'Vercel'], 'featured' => true,
        ],
        [
            'id' => 'p3', 'slug' => 'field-health-records', 'title' => 'Field Health Records',
            'client_name' => 'Summit Care NGO', 'category' => 'Mobile',
            'excerpt' => 'Offline-capable patient records for rural clinics.',
            'cover_image' => $img('photo-1576091160399-112ba8d25d1d'), 'cover_image_alt' => 'Field Health Records',
            'problem' => 'Clinics lacked reliable connectivity and paper records were error-prone.',
            'solution' => 'Cross-platform mobile app with encrypted local storage and background sync when online.',
            'result' => 'Data entry errors fell 45% and follow-up visit compliance reached 91%.',
            'metrics' => [['label' => 'Data errors', 'value' => '-45%']],
            'tech_stack' => ['Flutter', 'Firebase'], 'featured' => true,
        ],
        [
            'id' => 'p4', 'slug' => 'retail-analytics-dashboard', 'title' => 'Retail Analytics Dashboard',
            'client_name' => 'Bazaar Metrics', 'category' => 'Digital Transformation',
            'excerpt' => 'Single source of truth for 80+ franchise locations.',
            'cover_image' => $img('photo-1556155092-4902895f6dfa'), 'cover_image_alt' => 'Retail Analytics Dashboard',
            'problem' => 'Franchisees reported sales in inconsistent formats, delaying decisions.',
            'solution' => 'ETL pipelines, executive dashboard, and automated weekly PDF reports per region.',
            'result' => 'Leadership cut reporting cycles from 2 weeks to 24 hours.',
            'metrics' => [['label' => 'Reporting cycle', 'value' => '24h']],
            'tech_stack' => ['Python', 'React', 'BigQuery'], 'featured' => false,
        ],
    ],
    'posts' => [
        [
            'id' => 'b1', 'slug' => 'scope-saas-mvp', 'title' => 'How to Scope a SaaS MVP Without Overbuilding',
            'excerpt' => 'A practical framework we use with founders to ship a testable product in 90 days.',
            'content' => '<p>Founders often confuse a demo with a product. Start with one painful workflow, one user role, and one measurable outcome.</p>',
            'featured_image' => $img('photo-1555066931-4365d14bab8c'), 'featured_image_alt' => 'SaaS MVP',
            'author' => 'Sana Karim', 'category' => 'Product', 'published_at' => '2026-03-01T10:00:00.000Z', 'reading_time_minutes' => 7,
        ],
        [
            'id' => 'b2', 'slug' => 'low-bandwidth-ux', 'title' => 'Building for Low-Bandwidth Regions',
            'excerpt' => 'Performance and offline patterns that matter when your users are on 3G at altitude.',
            'content' => '<p>Optimize images, defer non-critical JS, and design optimistic UI with clear sync states.</p>',
            'featured_image' => $img('photo-1517694712202-d8f47886f668'), 'featured_image_alt' => 'Low bandwidth',
            'author' => 'Ahmed Raza', 'category' => 'Engineering', 'published_at' => '2026-02-12T10:00:00.000Z', 'reading_time_minutes' => 6,
        ],
        [
            'id' => 'b3', 'slug' => 'discovery-briefs', 'title' => 'Why We Pair Discovery Calls With Written Briefs',
            'excerpt' => 'Clear briefs reduce rework and help both sides align on success metrics early.',
            'content' => '<p>Every engagement starts with outcomes, constraints, and a phased roadmap—not a feature laundry list.</p>',
            'featured_image' => $img('photo-1522071820081-009f0129c71c'), 'featured_image_alt' => 'Discovery',
            'author' => 'Sana Karim', 'category' => 'Process', 'published_at' => '2026-01-20T10:00:00.000Z', 'reading_time_minutes' => 5,
        ],
    ],
    'testimonials' => [
        ['id' => 't1', 'client_name' => 'Elena Morris', 'role' => 'COO', 'company' => 'NorthPeak Freight', 'quote' => 'Appo Matrix felt like an extension of our team. They shipped on schedule despite tight connectivity constraints in the field.', 'rating' => 5],
        ['id' => 't2', 'client_name' => 'James Okonkwo', 'role' => 'Founder', 'company' => 'Bazaar Metrics', 'quote' => 'Clear communication, strong engineering, and zero fluff. Our dashboard is now the first tab our leadership opens every morning.', 'rating' => 5],
        ['id' => 't3', 'client_name' => 'Priya Nair', 'role' => 'Product Lead', 'company' => 'Silk Route Experiences', 'quote' => 'They translated vague tourism ideas into a booking flow that converts. Direct revenue impact within weeks of launch.', 'rating' => 5],
        ['id' => 't4', 'client_name' => 'Dr. Hassan Ali', 'role' => 'Program Director', 'company' => 'Summit Care NGO', 'quote' => 'The mobile app works offline when we need it most. Training clinic staff was smooth thanks to thoughtful UX.', 'rating' => 5],
    ],
    'services' => [
        ['id' => 's1', 'slug' => 'web-development', 'title' => 'Web Development', 'short_description' => 'Fast, accessible marketing sites and complex web applications built on modern stacks.', 'full_description' => '<p>From high-converting marketing sites to customer portals, we design for performance, SEO, and maintainability.</p>', 'icon' => 'globe', 'process_steps' => [], 'tech_stack' => ['Next.js', 'React', 'TypeScript']],
        ['id' => 's2', 'slug' => 'mobile-app-development', 'title' => 'Mobile App Development', 'short_description' => 'Native-feel iOS and Android apps with offline-ready architecture when you need it.', 'full_description' => '<p>We ship cross-platform and native mobile products with thoughtful UX for real-world network conditions.</p>', 'icon' => 'smartphone', 'process_steps' => [], 'tech_stack' => ['React Native', 'Flutter']],
        ['id' => 's3', 'slug' => 'saas-development', 'title' => 'SaaS Development', 'short_description' => 'Multi-tenant products with billing, auth, and admin tooling from day one.', 'full_description' => '<p>We help you go from MVP to scalable SaaS with secure auth, subscriptions, and observability baked in.</p>', 'icon' => 'layers', 'process_steps' => [], 'tech_stack' => ['Next.js', 'PostgreSQL', 'Stripe']],
        ['id' => 's4', 'slug' => 'digital-transformation-consulting', 'title' => 'Digital Transformation Consulting', 'short_description' => 'Audit legacy workflows and ship phased modernization without stopping the business.', 'full_description' => '<p>We map processes, prioritize quick wins, and align teams on a realistic transformation roadmap.</p>', 'icon' => 'compass', 'process_steps' => [], 'tech_stack' => ['Cloud migration', 'APIs']],
    ],
    'team' => [
        ['id' => 'tm1', 'name' => 'Sana Karim', 'role' => 'CEO & Product Strategist', 'bio' => 'Former product lead for B2B SaaS in Dubai and Islamabad.', 'social' => []],
        ['id' => 'tm2', 'name' => 'Ahmed Raza', 'role' => 'CTO', 'bio' => 'Full-stack architect with 12+ years shipping fintech and logistics platforms.', 'social' => []],
        ['id' => 'tm3', 'name' => 'Fatima Noor', 'role' => 'Design Lead', 'bio' => 'Brand and UX designer obsessed with clarity, accessibility, and type.', 'social' => []],
        ['id' => 'tm4', 'name' => 'Usman Khan', 'role' => 'Engineering Manager', 'bio' => 'Leads delivery squads across web and mobile with a calm, predictable cadence.', 'social' => []],
    ],
];
