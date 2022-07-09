import { NextApiRequest, NextApiResponse } from "next";
import { queryDatabase } from "../../../../utils/database";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    // TODO: add error handling here
    // retrieve the access_token
    const { refresh_token } = req.headers;
    const token = await queryDatabase('authTokens', { refresh_token: refresh_token });
    const access_token = await token.access_token;
    res.json(access_token);
}

export default handler