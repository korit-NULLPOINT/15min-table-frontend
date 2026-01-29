import axios from 'axios';

export const fetchDashboardStats = () =>
    axios.get('/admin/manage/stats');

export const fetchTimeSeries = (metric, bucket, from, to) =>
    axios.get('/admin/manage/stats/timeseries', {
        params: { metric, bucket, from, to },
    });
