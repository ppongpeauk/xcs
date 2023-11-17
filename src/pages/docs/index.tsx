import { Box } from '@mantine/core';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function App() {
  return (
    <Box
      style={{
        backgroundColor: 'white'
      }}
      py={1}
    >
      <style>
        {`
          .swagger-ui input[type=email], .swagger-ui input[type=file], .swagger-ui input[type=password], .swagger-ui input[type=search], .swagger-ui input[type=text], .swagger-ui textarea {
            color: black !important;
          }
        `}
      </style>
      <SwaggerUI url="https://petstore.swagger.io/v2/swagger.json"></SwaggerUI>
    </Box>
  );
}
