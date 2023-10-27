# AI Assistant Code Quickstart

This Quickstart provides details on the two Python files for creating a chatbot assistant using the LangChain library and a HuggingFace text generation model.

## Files

There are two Python files:

- `LLM.py` - Main code to load the model and ask questions  
- `LLM_install.py` - Code to download the HuggingFace model

## Overview  

The goal is to create a chatbot assistant that can describe what a provided Python code snippet does. The `LLM.py` file handles loading the model and asking questions, while `LLM_install.py` downloads the required HuggingFace model files.

The chatbot uses the [LangChain](https://github.com/hwchase17/langchain) library to simplify loading and querying the text generation model.

## Setup

### Requirements

- Python 3.7+
- LangChain (`pip install langchain`)
- HuggingFace Hub account and API key

### Downloading the model

The `LLM_install.py` file handles downloading the required model files from HuggingFace Hub.

It downloads the following files for the `lmsys/fastchat-t5-3b-v1.0` model:

- pytorch_model.bin
- added_tokens.json
- config.json  
- generation_config.json
- special_tokens_map.json
- spiece.model
- tokenizer_config.json

Set the `HUGGING_FACE_API_KEY` at the top to your own API key.

Run `python LLM_install.py` to download the files.  

### LLM.py

The main `LLM.py` file creates the chatbot assistant.

It loads the HuggingFace `lmsys/fastchat-t5-3b-v1.0` model using the LangChain `HuggingFacePipeline` class.

A `PromptTemplate` is defined to format the question and code snippet into the expected text generation prompt format.

The `ask_question` method takes a code snippet, formats it into a prompt using the template, queries the model, and prints the response.

So to use it:

1. Run `LLM_install.py` once to download the model  
2. Run `python LLM.py` and pass a Python code snippet as a command line argument
3. It will print the model's description of what that code does

This allows you to easily get an AI assistant's explanation of any Python code!

## Examples

Pass a Python code snippet as a command line arg:
```
ask_question("print('Hello World')")
```

It will print the model's response:
```
This code simply prints the string 'Hello World' to the console.
```


## Credits

- Model from Anthropic's HuggingFace: https://huggingface.co/lmsys
- LangChain library: https://github.com/hwchase17/langchain

## License

MIT