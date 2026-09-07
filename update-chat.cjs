const fs = require('fs');

let content = fs.readFileSync('src/pages/Chat.tsx', 'utf-8');

const newHandleSend = `
  const handleSend = async () => {
    if (!input.trim()) return;
    
    AudioService.playSoundEffect('pop');
    
    const newUserMsg = { id: Date.now().toString(), text: input, sender: 'user' as const };
    const currentMessages = [...messages, newUserMsg];
    setMessages(currentMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input, 
          history: messages 
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      AudioService.playSoundEffect('success');
      const responseText = data.text;
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'buddy'
      }]);
      
      setIsTyping(false);
      // Auto-play buddy response
      AudioService.playTamilWord(responseText);
    } catch (error: any) {
      console.error(error);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: \`மன்னிக்கவும்! (Sorry!) \${error.message}\`,
        sender: 'buddy'
      }]);
    }
  };
`;

content = content.replace(/const handleSend = \(\) => \{[\s\S]*?\}, 1500\);\s*\};/, newHandleSend.trim());

fs.writeFileSync('src/pages/Chat.tsx', content);
