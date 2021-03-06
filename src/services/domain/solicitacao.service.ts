import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { API_CONFIG } from './../../config/api.config';
import { Injectable } from '@angular/core';
import { SolicitacaoDTO } from '../../models/solicitacao.dto';


@Injectable()
export class SolicitacaoService {

    constructor(public http: HttpClient){};

    findAll(page : number = 0, linesPerPage : number = 24): Observable <SolicitacaoDTO[]>
    {
        return this.http.get<SolicitacaoDTO[]>(`${API_CONFIG.baseUrl}/solicitacoes?page=${page}&linesPerPage=${linesPerPage}`);
    };

    findBySolicitante(solicitante: string): Observable<SolicitacaoDTO[]>
    {
        return this.http.get<SolicitacaoDTO[]>(`${API_CONFIG.baseUrl}/solicitacoes/name?name=${solicitante}`);
    };

    findOne(id): Observable<SolicitacaoDTO>
    {
        return this.http.get<SolicitacaoDTO>(`${API_CONFIG.baseUrl}/solicitacoes/${id}`);
    };

    reject(id: string, data: string)
    {
        return this.http.put(
            `${API_CONFIG.baseUrl}/solicitacoes/${id}/rejeitar`,
             data,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    };

    findByUserLogged(): Observable<SolicitacaoDTO[]>
    {
        return this.http.get<SolicitacaoDTO[]>(`${API_CONFIG.baseUrl}/solicitacoes/doUsuarioLogado`);
    };

    create(data: any)
    {
        return this.http.post(
            `${API_CONFIG.baseUrl}/solicitacoes`,
            data,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    };

    filterByStatus(status: number, page : number = 0, linesPerPage : number = 24): Observable <SolicitacaoDTO[]>
    {   
        return this.http.get<SolicitacaoDTO[]>(`${API_CONFIG.baseUrl}/solicitacoes/findByStatus/${status}?page=${page}&linesPerPage=${linesPerPage}`);
    };
 
}