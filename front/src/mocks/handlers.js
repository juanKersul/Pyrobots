import { rest } from 'msw'

export const handlers = [

  // Handles a POST /login request
  rest.post('http://localhost:8000/register', (req, res, ctx) => {
    return res(
        ctx.status(200)
    );
  }),

];