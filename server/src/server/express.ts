import { Express, Request, Response } from 'express';

export function configureRoutes(app: Express): void {
  app.get('/', (req: Request, res: Response) => {
    res.status(200).send({ message: 'API do OpenCollaBoard funcionando!' });
  });
}
