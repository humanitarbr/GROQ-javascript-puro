const chave = 'sua chave aqui'; //https://console.groq.com/keys
const modelo1 = "llama3-groq-70b-8192-tool-use-preview";
const modelo2 = "llama3-8b-8192";
const modelo = modelo1

async function askGroq(question) {
    const apiKey = chave; // Substitua por sua chave de API
    const apiUrl = "https://api.groq.com/openai/v1/chat/completions";
  
    const requestBody = {
      messages: [
        {
          role: "user",
          content: question
        }
      ],
      model: modelo,
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: true, // Streaming ativado
      stop: null
    };
  
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let responseText = "";
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
  
        // Processa os chunks para extrair conteúdo válido
        const lines = chunk.split("\n").filter(line => line.trim() !== "");
        for (const line of lines) {
          if (line.startsWith("data:")) {
            const jsonData = line.substring(5).trim(); // Remove o prefixo "data:"
            if (jsonData === "[DONE]") break; // Final do stream
  
            try {
              const parsed = JSON.parse(jsonData);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                responseText += content; // Concatena o texto recebido
                //console.log("Parte recebida:", content); // Loga o texto recebido
              }
            } catch (err) {
              console.error("Erro ao parsear JSON:", err, jsonData);
            }
          }
        }
      }
  
      console.log("Resposta completa:", responseText); // Mostra a resposta final
    } catch (error) {
      console.error("Erro ao chamar a API:", error);
    }
  }
  
  // Chame a função com sua pergunta
  askGroq("bom dia");
  
  
 

  
  
  // Chame a função com sua pergunta
  askGroq("consegue me entender?");
  
