import {
	BlobServiceClient,
	StorageSharedKeyCredential,
	BlobSASPermissions,
	generateBlobSASQueryParameters
} from '@azure/storage-blob'

export const containerName = 'posts'

const accountName = process.env.AZURE_STORAGE_NAME
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY

if (!accountName || !accountKey) {
	throw new Error('Azure Storage account name or account key not provided')
}

const SharedKeyCredential = new StorageSharedKeyCredential(
	accountName,
	accountKey
)

const blobServiceClient = new BlobServiceClient(
	`https://${accountName}.blob.core.windows.net`,
	SharedKeyCredential
)

async function generateSASToken() {
	const containerClient = blobServiceClient.getContainerClient(containerName)

	const permissions = new BlobSASPermissions()
	permissions.read = true
	permissions.write = true
	permissions.create = true

	const expiryDate = new Date()
	expiryDate.setMinutes(expiryDate.getMinutes() + 30)

	const sasToken = generateBlobSASQueryParameters(
		{
			containerName: containerClient.containerName,
			permissions: permissions,
			startsOn: new Date(),
			expiresOn: expiryDate
		},
		SharedKeyCredential
	).toString()

	return sasToken
}

export default generateSASToken
