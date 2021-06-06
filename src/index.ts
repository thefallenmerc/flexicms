import initializeApp from "./app";

const port = 5000;

// Initialize App
initializeApp().then((app) => {
    // listen to port
    app.listen(port, () => {
        console.log("Server running at " + port);
    });
});
