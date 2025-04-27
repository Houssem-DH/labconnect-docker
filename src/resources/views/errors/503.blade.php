<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LabConnect - Maintenance</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap" rel="stylesheet">
    <style>
        /* General Styles */
        body {
            margin: 0;
            padding: 0;
            background-color: #f4f4f9;
            font-family: 'Poppins', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            color: #333;
        }

        .container {
            text-align: center;
            padding: 50px;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            width: 90%;
            animation: fadeInUp 1.2s ease-in-out;
        }

        @keyframes fadeInUp {
            0% {
                opacity: 0;
                transform: translateY(30px);
            }

            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Logo Style */
        .logo img {
            max-width: 180px;
            height: auto;
            margin-bottom: 30px;
            animation: fadeIn 1s ease-in;
        }

        /* Heading Style */
        h1 {
            font-size: 36px;
            margin-bottom: 15px;
            color: #2d3748;
            font-weight: 600;
            opacity: 0;
            animation: fadeInText 1.5s forwards;
        }

        @keyframes fadeInText {
            0% {
                opacity: 0;
                transform: translateY(20px);
            }

            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Paragraph Style */
        p {
            font-size: 18px;
            line-height: 1.8;
            color: #4a5568;
            margin-bottom: 30px;
            opacity: 0;
            animation: fadeInText 1.7s forwards 0.2s;
        }

        /* Spinner Style */
        .spinner {
            border: 8px solid #f3f3f3;
            border-top: 8px solid #e11d48;
            border-radius: 50%;
            width: 80px;
            height: 80px;
            margin: 30px auto;
            animation: spin 1.5s linear infinite;
        }

        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }

            100% {
                transform: rotate(360deg);
            }
        }

        /* Footer Styles */
        .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #a0aec0;
            padding: 15px 0;
            background-color: #f7fafc;
        }

        .footer a {
            color: #e11d48;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .footer a:hover {
            color: #2b6cb0;
            text-decoration: underline;
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
            h1 {
                font-size: 28px;
            }

            p {
                font-size: 16px;
            }

            .logo img {
                max-width: 150px;
            }

            .spinner {
                width: 60px;
                height: 60px;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="logo">
            <img src="assets/Logo.png" alt="LabConnect Logo">
        </div>
        <h1>We'll Be Back Soon!</h1>
        <p>
            Our website is currently under maintenance. We’re working hard to bring it back online as soon as possible.
            Thank you for your patience.
        </p>

        <!-- Centered Loading Spinner -->
        <div class="spinner"></div>

        <div class="footer">
            &copy; <span id="year"></span> LabConnect. All rights reserved.
            <br>
            <a href="https://www.labconnect.com/contact">Contact us</a> if you need further assistance.
        </div>
    </div>

    <script>
        // Set the current year dynamically
        document.getElementById('year').textContent = new Date().getFullYear();
    </script>
</body>

</html>
