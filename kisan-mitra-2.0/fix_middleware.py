import os

mws = {
    "authMiddleware": "module.exports = (req, res, next) => next();",
    "rateLimiter": "module.exports = (req, res, next) => next();",
    "validateRequest": "module.exports = (req, res, next) => next();",
    "requestLogger": "module.exports = (req, res, next) => { console.log(`${req.method} ${req.url}`); next(); };",
    "errorHandler": "module.exports = (err, req, res, next) => { console.error(err); res.status(500).json({ success: false, message: err.message }); };"
}

os.chdir('backend/middleware')

for name, content in mws.items():
    with open(f"{name}.js", 'w', encoding='utf-8') as f:
        f.write(content)

print("Middleware fixes written.")
