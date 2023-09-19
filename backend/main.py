import uvicorn # type: ignore
from multiprocessing import Process

def start_api():
    uvicorn.run("api:sourcesift", host="0.0.0.0", port=8000, log_level="debug", workers=4) # Change this to 4 for production.

if __name__ == "__main__":
    p = Process(target=start_api)
    p.start()
    p.join()
