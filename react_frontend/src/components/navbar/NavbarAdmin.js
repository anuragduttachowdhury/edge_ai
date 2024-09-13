// Chakra Imports
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Link, Text, useColorModeValue,useDisclosure,Image,Modal,ModalBody,ModalContent,ModalOverlay,ModalHeader,ModalCloseButton,VStack,Spinner } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import AdminNavbarLinks from 'components/navbar/NavbarLinksAdmin';
import Statictic_Logo  from 'assets/img/chat/statistic.png';
export default function AdminNavbar(props) {
	const [ scrolled, setScrolled ] = useState(false);
	const [loading, setLoading] = useState(false); // State to manage loading status
	const [modalData, setModalData] = useState(null);
	const { isOpen, onOpen, onClose } = useDisclosure();
	useEffect(() => {
		window.addEventListener('scroll', changeNavbar);

		return () => {
			window.removeEventListener('scroll', changeNavbar);
		};
	});

	const { secondary, message, brandText } = props;

	// Here are all the props that may change depending on navbar's type or state.(secondary, variant, scrolled)
	let mainText = useColorModeValue('navy.700', 'white');
	let secondaryText = useColorModeValue('gray.700', 'white');
	let navbarPosition = 'fixed';
	let navbarFilter = 'none';
	let navbarBackdrop = 'blur(20px)';
	let navbarShadow = 'none';
	let navbarBg = useColorModeValue('rgba(244, 247, 254, 0.2)', 'rgba(11,20,55,0.5)');
	let navbarBorder = 'transparent';
	let secondaryMargin = '0px';
	let paddingX = '15px';
	let gap = '0px';
	const changeNavbar = () => {
		if (window.scrollY > 1) {
			setScrolled(true);
		} else {
			setScrolled(false);
		}
	};

//get api call for statistic
const handleImageClick = async () => {
    onOpen(); // Opens the modal
    setLoading(true); // Set loading state to true when fetching data
    setModalData(null); // Clear previous data
    try {
      const response = await fetch('http://localhost:8081/api/v1/ai/overall_statistics');
      const data = await response.json();
      setModalData(data); // Store the new data
    } catch (error) {
      console.error('Error fetching data:', error);
      setModalData({ error: error.message }); // Handle the error
    } finally {
      setLoading(false); // Stop loading
    }
  };
  const formatResponse = (response) => {
	// Split the response by newlines and map each segment
	return response.split("\n").map((line, index) => {
	  // Handle empty lines (double newlines) by adding a line break
	  if (line.trim() === "") {
		return <br key={index} />;
	  } 
	  // Handle list items by checking for "- " at the start
	  else if (line.trim().startsWith("- ")) {
		return (
		  <Text key={index} pl={4}>
			{line}
		  </Text>
		);
	  }
	  // Handle regular text lines, including "Here's a breakdown"
	  else {
		return (
		  <Text key={index} mt={2}>
			{line}
		  </Text>
		);
	  }
	});
  };
  
	return (
		<Box
			position={navbarPosition}
			boxShadow={navbarShadow}
			bg={navbarBg}
			borderColor={navbarBorder}
			filter={navbarFilter}
			backdropFilter={navbarBackdrop}
			backgroundPosition='center'
			backgroundSize='cover'
			borderRadius='16px'
			borderWidth='1.5px'
			borderStyle='solid'
			transitionDelay='0s, 0s, 0s, 0s'
			transitionDuration=' 0.25s, 0.25s, 0.25s, 0s'
			transition-property='box-shadow, background-color, filter, border'
			transitionTimingFunction='linear, linear, linear, linear'
			alignItems={{ xl: 'center' }}
			display={secondary ? 'block' : 'flex'}
			minH='75px'
			justifyContent={{ xl: 'center' }}
			lineHeight='25.6px'
			mx='auto'
			mt={secondaryMargin}
			pb='8px'
			right={{ base: '12px', md: '30px', lg: '30px', xl: '30px' }}
			px={{
				sm: paddingX,
				md: '10px'
			}}
			ps={{
				xl: '12px'
			}}
			pt='8px'
			top={{ base: '12px', md: '16px', lg: '20px', xl: '20px' }}
			w={{
				base: 'calc(100vw - 6%)',
				md: 'calc(100vw - 8%)',
				lg: 'calc(100vw - 6%)',
				xl: 'calc(100vw - 350px)',
				'2xl': 'calc(100vw - 365px)'
			}}>
			<Flex
				w='100%'
				flexDirection={{
					sm: 'column',
					md: 'row'
				}}
				alignItems={{ xl: 'center' }}
				mb={gap}>
				<Box mb={{ sm: '8px', md: '0px' }}>
					<Breadcrumb>
						<BreadcrumbItem color={secondaryText} fontSize='sm' mb='5px'>
							<BreadcrumbLink href='#' color={secondaryText}>
								Pages
							</BreadcrumbLink>
						</BreadcrumbItem>

						<BreadcrumbItem color={secondaryText} fontSize='sm' mb='5px'>
							<BreadcrumbLink href='#' color={secondaryText}>
								{brandText}
							</BreadcrumbLink>
						</BreadcrumbItem>
					</Breadcrumb>
					{/* Here we create navbar brand, based on route name */}
					<Link
						color={mainText}
						href='#'
						bg='inherit'
						borderRadius='inherit'
						fontWeight='bold'
						fontSize='34px'
						_hover={{ color: { mainText } }}
						_active={{
							bg: 'inherit',
							transform: 'none',
							borderColor: 'transparent'
						}}
						_focus={{
							boxShadow: 'none'
						}}>
						{brandText}
					</Link>
				</Box>
				
			
				<Box ms="auto" w={{ sm: '100%', md: 'unset' }} display="flex" alignItems="center">
  <Image
    src={Statictic_Logo}
    w="60px"
    h="60px"
    mr="28px"
    onClick={handleImageClick}
    cursor="pointer"
    zIndex="1"
  />
    <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Statistics</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {loading ? (
          <VStack spacing={4}>
            <Spinner size="xl" />
            <Text>Loading statistics...</Text>
          </VStack>
        ) : modalData ? (
          modalData.error ? (
            <Text color="red.500">Error: {modalData.error}</Text>
          ) : (
            <Box>
              {formatResponse(modalData.response)} {/* Properly formatted response */}
            </Box>
          )
        ) : null}
      </ModalBody>
    </ModalContent>
  </Modal>
  <AdminNavbarLinks
    onOpen={props.onOpen}
    logoText={props.logoText}
    secondary={props.secondary}
    fixed={props.fixed}
    scrolled={scrolled}
  />
</Box>

			</Flex>
			{secondary ? <Text color='white'>{message}</Text> : null}
		</Box>
	);
}

AdminNavbar.propTypes = {
	brandText: PropTypes.string,
	variant: PropTypes.string,
	secondary: PropTypes.bool,
	fixed: PropTypes.bool,
	onOpen: PropTypes.func
};
