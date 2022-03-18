declare type ApiHandler<T> = (
  request: NextApiRequest,
  response: NextApiResponse<T>
) => Promise<void>;
