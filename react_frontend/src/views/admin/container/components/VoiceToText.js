import React, { useState, useEffect, useRef } from 'react';
import { MdKeyboardVoice, MdClose, MdVolumeUp, MdVolumeOff } from 'react-icons/md';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Input,
  Flex,
  Box,
  VStack,
  Button,
  useColorModeValue,
  IconButton,
  useClipboard,
  useToast,
  Skeleton,
  Switch,
  Select,Stack,Spacer,InputGroup,InputRightElement
} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';

const VoiceToText = () => {
  const [messages, setMessages] = useState([]);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTextToSpeechEnabled, setIsTextToSpeechEnabled] = useState(true);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const initialFocusRef = useRef();
  const [showBars, setShowBars] = useState(false);
  const timeoutIdRef = useRef(null);
  const animationIntervalRef = useRef(null);
  const bgColor = useColorModeValue('gray.200', 'gray.300');
  const userColor = useColorModeValue('blue.50', 'blue.900');
  const botColor = useColorModeValue('blue.900', 'gray.900');
  const { onCopy } = useClipboard();
  const toast = useToast();

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech Recognition API not supported');
      return;
    }

    const newRecognition = new SpeechRecognition();
    newRecognition.interimResults = true;
    newRecognition.lang = 'en-US';

    newRecognition.onresult = (event) => {
      const newTranscript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      setTranscript(newTranscript);
      setShowBars(true);
    };

    newRecognition.onend = () => {
      setIsListening(false);
      setShowBars(false);
      clearTimeout(timeoutIdRef.current);

      if (transcript.trim()) {
        handleSendTranscript(transcript);
      }
    };

    newRecognition.onerror = (event) => {
      console.error('Speech Recognition Error:', event.error);
    };

    setRecognition(newRecognition);

    // Load available voices
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      setSelectedVoice(availableVoices.find(voice => voice.name.includes('Google हिन्दी')) || availableVoices[0]);
    };

    if (window.speechSynthesis) {
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }

    return () => {
      newRecognition.stop();
      clearTimeout(timeoutIdRef.current);
      clearInterval(animationIntervalRef.current);
    };
  }, [transcript]);

  const handleListen = () => {
    setIsListening(true);
    setIsPopoverOpen(true);
    setShowBars(true);

    if (recognition) {
      recognition.start();
      setTranscript('');
    }
  };

  const handleStopListen = () => {
    setIsListening(false);
    if (recognition) {
      recognition.stop();
    }
    setShowBars(false);
    setIsPopoverOpen(false);
  };

  const handleClearTranscript = () => {
    setTranscript('');
  };

  const [animationIndex, setAnimationIndex] = useState(0);

  useEffect(() => {
    if (showBars) {
      animationIntervalRef.current = setInterval(() => {
        setAnimationIndex((prevIndex) => (prevIndex + 1) % 10);
      }, 500);
    } else {
      clearInterval(animationIntervalRef.current);
    }

    return () => clearInterval(animationIntervalRef.current);
  }, [showBars]);

  const handleSendTranscript = async (inputTranscript) => {
    if (!inputTranscript) return;
    setIsLoading(true);
    try {
      const query = inputTranscript;

      const response = await fetch('http://localhost:8081/api/v1/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      const responseQuery = data.answer || '';
      setTranscript('');
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: query, sender: 'user' },
        { text: responseQuery, sender: 'bot' },
      ]);

      // Convert response text to speech
      if (isTextToSpeechEnabled) {
        speak(responseQuery);
      }
    } catch (error) {
      console.error('Error sending transcript:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Failed to send transcript.', sender: 'user' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Text-to-speech not supported",
        description: "Your browser doesn't support text-to-speech functionality.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const toggleTextToSpeech = () => {
    setIsTextToSpeechEnabled(!isTextToSpeechEnabled);
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <Box position="relative" maxWidth="600px" margin="auto" padding="20px">
      <Box as="h2" tabIndex={0} fontSize="2xl" fontWeight="bold" mb={4}>
        Voice to Text
      </Box>
      <Box mb={4}>Please speak clearly into the microphone.</Box>
      <Flex alignItems="center" mb={4}>
        <InputGroup>
          <Input
            type="text"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            flex={1}
            padding="8px"
            borderColor="gray.300"
            borderRadius="md"
            mr={2}
            aria-label="Transcript"
          />
          {transcript && (
            <InputRightElement>
              <IconButton
                icon={<MdClose />}
                onClick={handleClearTranscript}
                variant="ghost"
                aria-label="Clear Transcript"
              />
            </InputRightElement>
          )}
        </InputGroup>
        <Button
          onClick={() => handleSendTranscript(transcript)}
          colorScheme="blue"
          ml={2}
          aria-label="Send Transcript"
        >
          Send
        </Button>
        <Popover
          initialFocusRef={initialFocusRef}
          placement='left-end'
          closeOnBlur={false}
          isOpen={isPopoverOpen}
          onClose={() => {
            setIsPopoverOpen(false);
            // Ensure this function is called only if recognition has ended and transcript is available
            if (transcript.trim()) {
              handleSendTranscript(transcript);
            }
          }}
        >
          <PopoverTrigger>
            <IconButton
              icon={<MdKeyboardVoice />}
              onClick={isListening ? handleStopListen : handleListen}
              ml={2}
              aria-label={isListening ? "Stop Listening" : "Start Listening"}
              colorScheme={isListening ? "red" : "teal"}
            />
          </PopoverTrigger>
          <PopoverContent color="white" bg="blue.800" borderColor="blue.800">
            <PopoverHeader pt={4} fontWeight="bold" border="0">
              Listening...
            </PopoverHeader>
            <PopoverArrow bg="blue.800" />
            <PopoverCloseButton />
            <PopoverBody height={150}>
              {showBars && (
                <VStack spacing={4} align="start">
                  <MdKeyboardVoice size={28} style={{ marginLeft: '130px' }} />
                  <Flex id="bars">
                    {[...Array(10)].map((_, index) => (
                      <Box
                        key={index}
                        bg="white"
                        w="10px"
                        h={`${index * 7}px`}
                        mr="4px"
                        mb="1px"
                        borderRadius="full"
                        transition="height 0.2s, opacity 0.2s"
                        opacity={index > animationIndex ? 1 : 0.35}
                      />
                    ))}
                  </Flex>
                </VStack>
              )}
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>
      <Flex alignItems="center" mb={4}>
        <Switch
          isChecked={isTextToSpeechEnabled}
          onChange={toggleTextToSpeech}
          mr={2}
        />
        <Box as="span" mr={4}>Text-to-Speech</Box>
        {isSpeaking && <MdVolumeUp size={24} style={{ marginRight: '8px' }} />}
        <Select
          value={selectedVoice ? selectedVoice.name : ''}
          onChange={(event) => {
            const selectedVoiceName = event.target.value;
            const voice = voices.find(v => v.name === selectedVoiceName);
            setSelectedVoice(voice);
          }}
          disabled={!isTextToSpeechEnabled}
          width="200px"
        >
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name}
            </option>
          ))}
        </Select>
      </Flex>
      <Stack spacing={2} direction="column-reverse">
        {isLoading ? (
          <Flex justifyContent="center" alignItems="center" mt={4} height="100px">
            <Stack spacing={4} width="200px">
              <Skeleton height='20px' />
              <Skeleton height='20px' />
              <Skeleton height='20px' />
            </Stack>
          </Flex>
        ) : (
          messages.map((message, index) => (
            <Flex
              key={index}
              direction={message.sender === 'user' ? 'row-reverse' : 'row'}
              align="center"
              mb={2}
            >
              <Box
                p={3}
                borderRadius="md"
                maxWidth="75%"
                bg={message.sender === 'user' ? userColor : botColor}
                color={message.sender === 'user' ? 'black' : 'white'}
                textAlign="left"
                whiteSpace="pre-wrap"
              >
                {message.text}
              </Box>
              <Spacer />
              <IconButton
                icon={<CopyIcon />}
                onClick={() => handleCopy(message.text)}
                variant="outline"
                aria-label="Copy message"
                colorScheme="blue"
              />
              {message.sender === 'bot' && isTextToSpeechEnabled && (
                <IconButton
                  icon={isSpeaking ? <MdVolumeOff /> : <MdVolumeUp />}
                  onClick={() => speak(message.text)}
                  variant="outline"
                  aria-label="Speak message"
                  colorScheme="blue"
                  ml={2}
                />
              )}
            </Flex>
          ))
        )}
      </Stack>
    </Box>
  );
};

export default VoiceToText;
