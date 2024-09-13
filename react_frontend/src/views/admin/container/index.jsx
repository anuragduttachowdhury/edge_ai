import React from 'react'
// import ContainerList from "./components/ContainerList";
import ContainerList from './components/ContainerList';
import { Route ,Routes} from 'react-router-dom';
import {Box} from '@chakra-ui/react';
export default function Container() {
  return (
    <Box pt={{ base: "130px", md: "100px", xl: "80px" }}>
     <Routes> {/* Wrap your Route inside Routes */}
    <Route path="/admin/container" element={<ContainerList />} />
  </Routes></Box>
  )
}
