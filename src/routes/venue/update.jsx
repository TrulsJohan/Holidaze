import { UpdateVenueForm } from '../../components/Forms/UpdateVenueForm';

export function RenderUpdateVenue() {
    return (
        <div className="min-h-screen px-8 py-12 bg-gray-50">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-semibold text-gray-900 mb-8">
                    Edit Venue
                </h1>
                <UpdateVenueForm />
            </div>
        </div>
    );
}
