
export interface Job {
    id: string;
    title: string;
    company: JobCompany;
    location: string;
    publicationDate: string;
    description: string;
    shortDescription: string;
    type: string;
    level: string;
    categories: string[];
    landingPageUrl: string;
    tags: string[];
    salary: string;
    salaryMin: number | null;
    salaryMax: number | null;
    contractTime: string;
}

export interface JobCompany {
    name: string;
}

export interface AdzunaApiResponse {
    __CLASS__: string;
    results: AdzunaJob[];
    count: number;
    mean: number;
}

export interface AdzunaJob {
    id: string;
    title: string;
    description: string;
    created: string;
    redirect_url: string;
    salary_min?: number;
    salary_max?: number;
    salary_is_predicted?: number;
    latitude?: number;
    longitude?: number;
    contract_type?: string;
    contract_time?: string;
    location: {
        __CLASS__: string;
        display_name: string;
        area: string[];
    };
    category: {
        __CLASS__: string;
        label: string;
        tag: string;
    };
    company: {
        __CLASS__: string;
        display_name: string;
    };
}

export interface JobSearchParams {
    keywords: string;
    location: string;
    category?: string;
    country: string;
    page: number;
    resultsPerPage?: number;
    sortBy?: string;       
    contractType?: string;
    contractTime?: string;
    salaryMin?: number;
}

export interface JobSearchResult {
    jobs: Job[];
    totalResults: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
}
