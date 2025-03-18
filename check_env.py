import os
from dotenv import load_dotenv
import pathlib

# Try different env file variations
base_dir = pathlib.Path('.')
env_files = [
    base_dir / "owl" / ".env",
    base_dir / ".env",
    base_dir / "owl" / ".env.local",
    base_dir / ".env.local",
]

# Load environment from first available env file
for env_path in env_files:
    if env_path.exists():
        print(f"Found env file: {env_path}")
        load_dotenv(dotenv_path=str(env_path))
        break

# Check for OpenAI API key
openai_key = os.environ.get("OPENAI_API_KEY", "Not found")
openai_key_masked = openai_key[:10] + "..." if len(openai_key) > 10 else openai_key

print(f"OpenAI API Key: {openai_key_masked}")
print(f"Etherscan API Key: {os.environ.get('ETHERSCAN_API_KEY', 'Not found')}")
print(f"CMC API Key: {os.environ.get('CMC_API_KEY', 'Not found')}")

# List all environment variables starting with specific prefixes
prefixes = ["OPENAI", "AZURE", "ETH", "CMC", "INJECTIVE"]
print("\nAll matching environment variables:")
for key, value in os.environ.items():
    if any(key.startswith(prefix) for prefix in prefixes):
        masked_value = value[:5] + "..." if len(value) > 5 else value
        print(f"  {key}: {masked_value}")