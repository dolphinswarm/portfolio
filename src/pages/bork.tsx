const Bork = () => {
    return (
        <section
            style={{
                padding: "4rem 1.25rem",
                maxWidth: 900,
                width: "100%",
                margin: "0 auto",
            }}
        >
            <h1 style={{ margin: 0, fontSize: "clamp(2rem, 5vw, 4rem)" }}>
                BORK
            </h1>
            <p style={{ marginTop: "1rem", opacity: 0.85, lineHeight: 1.6 }}>
                You found the Konami route.
            </p>
        </section>
    );
};

export default Bork;
