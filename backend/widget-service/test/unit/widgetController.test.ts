import {Request, Response} from 'express';
import Widget from '../../src/models/weatherWidget';
import * as weatherService from '../../src/services/weatherService';
import {
    getAllWidgets,
    createNewWidget,
    deleteWidgetById,
    getWidgetById
} from '../../src/controllers/widgetController';
import {AppError} from '../../src/handlers/globalErrorHandler';

jest.mock('../../src/models/weatherWidget');
jest.mock('../../src/services/weatherService');

const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.end = jest.fn().mockReturnValue(res);
    return res;
};

const mockRequest = (params = {}, body = {}): Request =>
    ({params, body} as unknown as Request);

describe('Widget Controller - Unit Tests', () => {
    const next = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllWidgets', () => {
        it('should return enriched widgets', async () => {
            const req = mockRequest();
            const res = mockResponse();
            (Widget.find as jest.Mock).mockReturnValue({lean: () => [{location: 'Berlin'}]});
            (weatherService.fetchWeather as jest.Mock).mockResolvedValue({temperature: 25});
            await getAllWidgets(req, res, next);
            expect(res.json).toHaveBeenCalledWith([
                {location: 'Berlin', weather: {temperature: 25}}
            ]);
        });

        it('should handle DB error gracefully', async () => {
            const req = mockRequest();
            const res = mockResponse();
            (Widget.find as jest.Mock).mockImplementation(() => {
                throw new Error('DB read fail');
            });
            await getAllWidgets(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('createNewWidget', () => {
        it('should create a new widget', async () => {
            const req = mockRequest({}, {location: 'Berlin'});
            const res = mockResponse();
            const mockWidget = {
                _id: '1',
                location: 'Berlin',
                createdAt: new Date().toISOString(),
                toObject: function () {
                    return {
                        _id: this._id,
                        location: this.location,
                        createdAt: this.createdAt,
                    };
                },
            };

            (Widget.create as jest.Mock).mockResolvedValue(mockWidget);
            await createNewWidget(req, res, next);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    _id: '1',
                    location: 'Berlin',
                    createdAt: expect.any(String),
                })
            );
        });


        it('should error when location is missing', async () => {
            const req = mockRequest({}, {});
            const res = mockResponse();
            await createNewWidget(req, res, next);
            const err = next.mock.calls[0][0] as AppError;
            expect(err).toBeInstanceOf(AppError);
            expect(err.message).toBe('Location is required');
            expect(err.statusCode).toBe(400);
        });

        it('should handle DB error', async () => {
            const req = mockRequest({}, {location: 'Berlin'});
            const res = mockResponse();

            (Widget.create as jest.Mock).mockRejectedValue(new Error('DB error'));

            await createNewWidget(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('deleteWidgetById', () => {
        it('should delete and return 204', async () => {
            const req = mockRequest({id: 'abc'});
            const res = mockResponse();
            (Widget.findByIdAndDelete as jest.Mock).mockResolvedValue({_id: 'abc'});
            await deleteWidgetById(req, res, next);
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.end).toHaveBeenCalled();
        });

        it('should 404 if not found', async () => {
            const req = mockRequest({id: 'abc'});
            const res = mockResponse();
            (Widget.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
            await deleteWidgetById(req, res, next);
            const err = next.mock.calls[0][0] as AppError;
            expect(err.message).toBe('Widget not found');
            expect(err.statusCode).toBe(404);
        });

        it('should handle DB delete error', async () => {
            const req = mockRequest({id: 'abc'});
            const res = mockResponse();
            (Widget.findByIdAndDelete as jest.Mock).mockRejectedValue(new Error('delete failed'));
            await deleteWidgetById(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('getWidgetById', () => {
        it('should return widget with weather', async () => {
            const req = mockRequest({id: 'xyz'});
            const res = mockResponse();
            (Widget.findById as jest.Mock).mockReturnValue({lean: () => Promise.resolve({location: 'Berlin'})});
            (weatherService.fetchWeather as jest.Mock).mockResolvedValue({temperature: 22});
            await getWidgetById(req, res, next);
            expect(res.json).toHaveBeenCalledWith({location: 'Berlin', weather: {temperature: 22}});
        });

        it('should 404 if widget not found', async () => {
            const req = mockRequest({id: 'xyz'});
            const res = mockResponse();
            (Widget.findById as jest.Mock).mockReturnValue({lean: () => Promise.resolve(null)});
            await getWidgetById(req, res, next);
            const err = next.mock.calls[0][0] as AppError;
            expect(err.statusCode).toBe(404);
        });

        it('should handle DB error in getWidgetById', async () => {
            const req = mockRequest({id: 'bad-id'});
            const res = mockResponse();
            (Widget.findById as jest.Mock).mockReturnValue({
                lean: () => Promise.reject(new Error('findById fail')),
            });
            await getWidgetById(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });
});
