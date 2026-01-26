export default `
        #wrapper {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
        }
        label {
            margin-bottom: 0.2rem;
            font-size: 1rem;
        }
        
        .input-group-wrapper {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 2rem;
            padding: 1rem;
            border: 1px solid #fff;
            border-radius: 1rem;
        }

        .input-wrapper {
            width: 100%;
            display:flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        input {
            width: 30%;
            padding: 0.8rem;
            font-size: 1rem;
            border: 1px solid #fff;
            border-radius: 1rem;
            color: #fff;
            background: none;
        }
        textarea {
            width: 80%;
            padding: 0.8rem;
            font-size: 1rem;
            border: 1px solid #fff;
            border-radius: 1rem;
            color: #fff;
            background: none;
        }

        #submit {
            background: none;
            border: 1px solid #fff;
            border-radius: 1rem;
            width: fit-content;
            padding: 0.5rem 1rem;
            color: white;
            font-size: 1rem;
            font-weight: bold;
        }
`;