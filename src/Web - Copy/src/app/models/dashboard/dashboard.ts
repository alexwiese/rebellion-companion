export class Dashboard {
    constructor(
        public userName: string,
        public startDate: Date,
        public endDate: Date,
        public newBusinesses: number,
        public newPersons: number,
        public newSites: number,
        public newAssets: number,
        public newJobs: number,
        public jobsCompleted: number) {}
}
