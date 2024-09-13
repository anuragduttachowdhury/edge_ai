import React,{useState,useEffect} from 'react'
import Card from 'components/card/Card'
import {useMediaQuery,Box,VStack, HStack, Text, Badge, Icon, Button,Spinner,useDisclosure,Image,Modal,ModalBody,ModalContent,ModalOverlay,ModalHeader,ModalCloseButton,List,ListItem,ModalFooter} from "@chakra-ui/react";
import { FaDocker, FaPlay } from 'react-icons/fa';
import chatImage from 'assets/img/chat/chat.png';
import VoiceToText from './VoiceToText';
const ContainerList = () => {
  const [containers, setContainers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false); // State to toggle blur effect
  const [isLargeThen672] = useMediaQuery("min-width: 672px");
  const mTop = isLargeThen672 ? "" : "50px";
//api call for container list
  useEffect(() => {
    const fetchContainers = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/v1/container_list');
        if (!response.ok) {
          throw new Error('Failed to fetch container data');
        }
        const data = await response.json();
        const formattedData = data.map(container => ({
          id: container.id,
          name: container.names.replace(/[\[\]\/]/g, ''),
          image: container.image,
          status: container.state
        }));
        setContainers(formattedData);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchContainers();
  }, []);

  const handleChatClick = () => {
    setIsModalOpen(true);
    setIsBlurred(true); // Apply blur when modal is open
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsBlurred(false); // Remove blur when modal is closed
  };

  if (isLoading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return <Text color="red.500">Error: {error}</Text>;
  }

  return (
    <>
  <Box pt={"80px"}>
  <Box mt={mTop} filter={isBlurred ? "blur(5px)" : "none"}>
  

    {containers.map((container) => (
      <Card
        mt={5}
        pt="5px"
        pb="20px"
        direction="column"
        w="100%"
        px={{ base: "10px", md: "20px", lg: "30px" }}
        overflowX={{ sm: "auto", md: "auto", lg: "auto" }}
        position="relative" // Make the card relative for absolute child positioning
      >
        <VStack align="stretch" spacing={3}>
          <HStack justify="space-between">
            <HStack>
              <Icon as={FaDocker} color="blue.500" boxSize={6} />
              <Text fontWeight="bold" fontSize="lg">
                {container.name}
              </Text>
            </HStack>
            <Badge colorScheme={container.status === "Running" ? "red" : "green"}>
              status={container.status}
            </Badge>
          </HStack>

          <HStack align="stretch" spacing={1}>
            <Text fontWeight="semibold">Image:</Text>
            <Text fontSize="sm">{container.image}</Text>
          </HStack>
        </VStack>

      
          
      </Card>
    ))}
    <Image
          src={chatImage}
          alt="Statistics"
          position="absolute"
          bottom="60px"
          right="20px"
          boxSize="80px"
          cursor="pointer"
          onClick={handleChatClick}
        />

  </Box>

       {/* Modal for more details */}
       <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Statistics</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VoiceToText/>
          </ModalBody>

          {/* <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCloseModal}>
              Close
            </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
</Box>

            </>

  )
}

export default ContainerList