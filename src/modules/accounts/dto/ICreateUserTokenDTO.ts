export interface ICreateUserTokenDTO {
    expires_date: Date;
    user_id: string;
    refresh_token: string;
}
