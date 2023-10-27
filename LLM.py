#!/usr/bin/env python3
from langchain.llms import HuggingFacePipeline
from langchain import PromptTemplate, LLMChain


def set_model():
    model_id = "lmsys/fastchat-t5-3b-v1.0"
    llm = HuggingFacePipeline.from_model_id(
        model_id=model_id,
        task="text2text-generation",
        model_kwargs={"temperature": 0, "max_length": 1000},
    )

    template = """
    You are a friendly chatbot assistant that responds conversationally to users' questions.
    Keep the answers short, unless specifically asked by the user to elaborate on something.
    
    Question: {question}
    
    Answer:"""

    prompt = PromptTemplate(template=template, input_variables=["question"])

    llm_chain = LLMChain(prompt=prompt, llm=llm)
    return llm_chain


def ask_question(code):
    question = f"Please provide a detailed explanation of the following code.:\n '''{code}'''"
    llm_chain = set_model()
    result = llm_chain(question)
    print(code)
    print(result['text'].split("``` ")[1])
