## Backend

```
micromamba activate openreal2sim_scripts
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

## Frontend

```
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

npm run dev
```