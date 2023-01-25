---
slug: "intro"
title: "Intro"
tags: ["edu","docs","quickstart"]
description: >
  Getting Started using Emporous Client.
---

This guide provides an overview of Emporous including everything that you need to get started from obtaining the necessary tooling to building, publishing and consuming content.

# What You Will Learn

* Emporous Client
* Collection Structure
* Interacting with Collections
* User Defined Attributes

## Tools Required

The following tools are required in order to complete the steps illustrated in this guide:

* [skopeo](https://github.com/containers/skopeo)
* [jq](https://stedolan.github.io/jq/manual)

## Emporous Client

The primary method for interacting with Emporous resources is by using the [Client](https://github.com/emporous/emporous-go). This CLI based utility includes capabilities to support assembling, publishing, retrieval and discovery.

The Client can be installed from the [releases](https://github.com/emporous/emporous-go/releases) page. Download the binary that corresponds with your operating system and add the binary to your `$PATH`.

Confirm the installation was successful by invoking the client:

````bash
emporous version
````

Details related to the client will be presented if installation is successful.

Now that the client has been installed and configured, you are ready to start interacting with Emporous content.

## Introduction to Collections

The primary purpose of the _client_ is to facilitate the interaction with _Collections_. A Collection is a set of content that is bundled together and stored as an OCI artifact. The individual resources within the artifact are decorated with additional metadata to enable filtering, discovery and retrieval. The following sections will discuss the lifecycle of a collection including mechanisms for interacting with the content.

## Interacting with a Collection

Now that we know what a Collection refers to, let's begin working through the lifecycle of a collection by first assembling one.

### Assembling a Collection

Any type of content can be represented by Emporous. While the solution can be applied to a variety of use cases ranging from website content to AI model management, one of the most basic examples is managing a set of files on a file system. Files are given names, properties and organized into directories descending from a top level root. Emporous makes use of similar paradigms. Content is added to a top level directory, known as a workspace. Their existence along with the relationship to other content is assembled by the client into a Directed Acyclic Graph (DAG).

To begin, first create a directory called `emporous-workspace` which will contain the content Emporous will manage and enter the newly created directory:

````bash
mkdir emporous-workspace
pushd emporous-workspace
````

Now that a workspace is available, lets create a series of files for our file system use case. These files can be in any format, but let's create a mix of text files and jpeg photos.

Populate a file called `overview.txt` in the top level workspace directory with some sample content:

````bash
echo 'Hawaiian Resources' > overview.txt
````

Next, create a directory called `content` which will contain two files: a text file containing a greeting along with a photo of a fish.

````sh
mkdir content
cd content
echo 'aloha' > aloha.txt
curl -LsO https://raw.githubusercontent.com/emporous/emporous-go/main/test/fish.jpg
popd
````

At this point, you should have three (files) in total as depicted by the output of the `tree` command below:

````sh
tree emporous-workspace

emporous-workspace
├── content
│   ├── aloha.txt
│   └── fish.jpg
└── overview.txt

1 directory, 3 files
````

### Publishing a Collection

With the desired set of files contained within the `emporous-workspace` directory, the next step is to publish a collection. This process performs three actions:

1. Discovers all content within the workspace.
2. Produces an OCI artifact based on the content of the collection.
3. Publishes the artifact to a remote repository.

To publish the collection to a remote registry, let's say that an instance of `registry` was running on our local machine and there is the desire to publish the collection to `localhost:5000/emporous/getting-started:latest`.

You can start by spinning up an instance of `registry` using your container runtime of choice. The example below uses `docker`:

```bash
docker run -d --rm -p 5000:5000 registry
```

Using the `build` and `push` subcommands, execute the following to publish the workspace to a remote registry. Additional options are also available for specifying the location of a file containing authentication details or communicating with an insecure or HTTP based registry if necessary.

````bash
emporous build collection emporous-workspace localhost:5000/emporous/getting-started:latest
emporous push --plain-http localhost:5000/emporous/getting-started:latest
````

>Example:
>````bash
>~$ emporous build collection emporous-workspace localhost:5000/emporous/getting-started:latest
>
>INFO[0000] Artifact sha256:d277f57979cba85359dd221607a936bd29fcac2341bc6a55f8c827803bb9d86a built with reference name localhost:5000/emporous/getting-started:latest
>
>~$ emporous push --plain-http localhost:5000/emporous/getting-started:latest
>
>INFO[0000] Artifact sha256:d277f57979cba85359dd221607a936bd29fcac2341bc6a55f8c827803bb9d86a published to localhost:5000/emporous/getting-started:latest
>````

Do not be concerned about any `WARN` messages in the output of the _push_ execution. These may be emitted by the underlying [ORAS](https://oras.land) library the client utilizes.

### Exploring the Published Artifact

With the collection published, lets explore the contents of the OCI artifact that the client produced. There are a number of tools that can be used to investigate the composition of resources within an OCI registry. For readability, we will use `skopeo` and `jq`, however one could simply use `curl` to produce the same results.

First, we will review the contents of the [manifest](https://oras.land/cli/3_manifest_config/) to view each of the layers that were published. The `skopeo inspect` subcommand with the `--raw` flag will retrieve the contents of the manifest. The result can be piped to `jq` to improve the readability. Note, the `--tls-verify=false` flag also needs to be supplied in this instance as communication with the remote registry will utilize HTTP.  

````bash
skopeo inspect --raw --tls-verify=false docker://localhost:5000/emporous/getting-started:latest | jq
````

> Example:
>````
>~$ skopeo inspect --raw --tls-verify=false docker://localhost:5000/emporous/getting-started:latest | jq
>{
>  "schemaVersion": 2,
>  "mediaType": "application/vnd.oci.image.manifest.v1+json",
>  "config": {
>    "mediaType": "application/vnd.emporous.config.v1+json",
>    "digest": "sha256:5bd9c6ed24d5eb1396a586b700c39fb89da71d6006208ba8a99ffd04b4e28d90",
>    "size": 173
>  },
>  "layers": [
>    {
>      "mediaType": "image/jpeg",
>      "digest": "sha256:2e30f6131ce2164ed5ef017845130727291417d60a1be6fad669bdc4473289cd",
>      "size": 5536,
>      "annotations": {
>        "emporous.attributes": "{\"converted\":{\"org.opencontainers.image.title\":\"content/fish.jpg\"},\"unknown\":{}}",
>        "org.opencontainers.image.title": "content/fish.jpg"
>      }
>    },
>    {
>      "mediaType": "text/plain; charset=utf-8",
>      "digest": "sha256:908784d6a78ecc1e08b63aa4af486eadba500caeeb131b6406ad1bd210099386",
>      "size": 19,
>      "annotations": {
>        "emporous.attributes": "{\"converted\":{\"org.opencontainers.image.title\":\"overview.txt\"},\"unknown\":{}}",
>        "org.opencontainers.image.title": "overview.txt"
>      }
>    },
>    {
>      "mediaType": "text/plain; charset=utf-8",
>      "digest": "sha256:a79ec113dc7ece4dee24a5ffc967b4574c22270c99e9432773b63913ac62c95e",
>      "size": 6,
>      "annotations": {
>        "emporous.attributes": "{\"converted\":{\"org.opencontainers.image.title\":\"content/aloha.txt\"},\"unknown\":{}}",
>        "org.opencontainers.image.title": "content/aloha.txt"
>      }
>    }
>  ],
>  "annotations": {
>    "emporous.attributes": "{}"
>  }
>}
>````
>

Reviewing the contents of the retrieved manifest, the Emporous client published four (4) key items:

1. A [Manifest Config](https://oras.land/cli/3_manifest_config/)
2. A layer for each of the assets contained within the workspace. 

Each item within the workspace becomes a layer within the artifact. By inspecting each layer, observe the properties that have been associated. For example, the picture of the fish:

````json
{
  "mediaType": "image/jpeg",
  "digest": "sha256:2e30f6131ce2164ed5ef017845130727291417d60a1be6fad669bdc4473289cd",
  "size": 5536,
  "annotations": {
    "emporous.attributes": "{\"converted\":{\"org.opencontainers.image.title\":\"content/fish.jpg\"},\"unknown\":{}}",
    "org.opencontainers.image.title": "content/fish.jpg"
}
````

One can easily determine that the content contains a picture due to the _mediaType_ ```image/jpeg```. In addition, the client also adds the relative location within the workspace to the ```org.opencontainers.image.title``` annotation of the layer representing the primary value for the content. This is used to reconstruct the assets as the artifact as a whole is retrieved. The topic of reassembly will be covered in the next section. Attributes specific to Emporous are also added under annotations as `emporous.attributes`. We will see how we can leverage these attributes later in the [User Defined Attributes](#user-defined-attributes) section.

### Retrieving a Collection

Just as easy as it was to publish a collection, a collection can be retrieved from remote locations so that the contents can be reassembled locally. First, remove the existing `emporous-workspace` directory locally if it still exists.

````bash
rm -rf emporous-workspace
````

Then, we will recreate an empty instance of the `emporous-workspace` and use the `pull` subcommand of the client, specify the reference of the artifact (collection) published to the registry previously. Since we are using an unsigned and insecure registry instance, we need to include the ``--plain-http` and `--no-verify` options:

```bash
mkdir emporous-workspace && cd emporous-workspace
emporous pull --plain-http --no-verify localhost:5000/emporous/getting-started:latest
```

Example output:

>````bash
>~$ emporous pull --plain-http --no-verify localhost:5000/emporous/getting-started:latest
>
>INFO[0000] Found matching digest sha256:d277f57979cba85359dd221607a936bd29fcac2341bc6a55f8c827803bb9d86a 
>INFO[0000] Found matching digest sha256:908784d6a78ecc1e08b63aa4af486eadba500caeeb131b6406ad1bd210099386 
>INFO[0000] Found matching digest sha256:ec1f8a8d6dcb53c52284e9f9e4190da1e9e71ee4a5b772a755c925cdae09c360 
>INFO[0000] Found matching digest sha256:2e30f6131ce2164ed5ef017845130727291417d60a1be6fad669bdc4473289cd 
>INFO[0000] Found matching digest sha256:a79ec113dc7ece4dee24a5ffc967b4574c22270c99e9432773b63913ac62c95e 
>INFO[0000] Copied collection(s) to .
>````

Once again execute the `tree` command to verify the `emporous-workspace` contains the expected contents: 

````bash
~$ tree

.
├── content
│   ├── aloha.txt
│   └── fish.jpg
└── overview.txt

1 directory, 3 files
````

As illustrated by the response, the collection successfully reassembled the contents of the `emporous-workspace` directory. This was once again all made possible because of the _annotations_ within each layer of the artifact. In the next section, we will extend this concept of using metadata contained within an object to enable additional means of classifying resources.

## User Defined Attributes

By default, the Emporous client attaches an annotation to each resource within a collection to associate the relative location of the content within a workspace using the key `org.opencontainers.image.title`. This annotation is one of the well know [Predefined Keys](https://github.com/opencontainers/image-spec/blob/main/annotations.md) as defined by the Open Container Initiative.

One of the key features of Emporous is the ability to _reference_ content amongst a variety of different content types. This is accomplished, you guessed it, through attributes associated to each piece of content, and in this case, annotations on the layer. Aside from the default values that are produced by the Emporous client, end users have the ability to define their own sets of attributes under the `emporous.attributes` key of `annotations`. This is accomplished using a `DataSetConfiguration`.

A `DataSetConfiguration` allows for a set of attributes to be associated with one or more resources within a collection and is represented in the following format:

````yaml
apiVersion: client.emporous.io/v1alpha1
kind: DataSetConfiguration
files:
  - file: <pattern>
    attributes:
      key: value
      key2: value2
````

A set of attributes can be associated to a given pattern of content and multiple declarations can be present within the `DataSetConfiguration`.

To demonstrate how a `DataSetConfiguration` can be used to transform the attributes of a collection, let's consider attributes that can be applied to the contents of the workspace contained in the `emporous-workspace` directory.

In total, there are three files. Let's add a separate attribute to each file.

* `overview.txt` - `series: Hawaiian`
* `content/aloha.txt` - `classification: greeting`
* `content/fish.jpg` - `animal: fish`

Mapping the desired attributes to the resources in the collection results in the following set of content that would be included within the `files` property of a `DataSetConfiguration`:

````yaml
- file: overview.txt
  attributes:
    series: Hawaiian
- file: content/aloha.txt
  attributes:
    classification: greeting
- file: content/fish.jpg
  attributes:
    animal: fish
````

In addition, let's add an attribute, `content: 'true'`, to each of the files within the `content` directory. This can be achieved using a wildcard pattern that retrieves all files within the `content` directory of the workspace shown below:

````yaml
- file: content/*
  attributes:
    content: 'true'
````

Putting it all together, to create a `DataSetConfiguration` resource in a file called `dataset-configuration.yaml`, execute the following in the _parent directory_ of the `emporous-workspace`:

````yaml
cat << EOF > dataset-configuration.yaml
apiVersion: client.emporous.io/v1alpha1
kind: DataSetConfiguration
collection:
  files:
    - file: overview.txt
      attributes:
        series: Hawaiian
    - file: content/aloha.txt
      attributes:
        classification: greeting
    - file: content/fish.jpg
      attributes:
        animal: fish
    - file: content/*
      attributes:
        content: 'true'
EOF
````

Associating a `DataSetConfiguration` to a collection is achieved when building a workspace by specifying the `--dsconfig` flag and referencing the location of the resource.

### Publishing a Collection With Attributes

Build and publish a new tag of the collection called `dsconfig` with the additional metadata associated to the content by executing the following commands:

```bash
emporous build collection emporous-workspace localhost:5000/emporous/getting-started:dsconfig --dsconfig=dataset-configuration.yaml
emporous push --plain-http localhost:5000/emporous/getting-started:dsconfig
```

Example output:

>````bash
>~$ emporous build collection emporous-workspace localhost:5000/emporous/getting-started:dsconfig --dsconfig=dataset-configuration.yaml
>INFO[0000] Artifact sha256:abf36eacbe1ae024a00ea468c383bcf5cfb94895044f9001b317b7fd7fc3b1b2 built with reference name localhost:5000/emporous/getting-started:dsconfig
>
>~$ emporous push --plain-http localhost:5000/emporous/getting-started:dsconfig
>INFO[0000] Artifact sha256:abf36eacbe1ae024a00ea468c383bcf5cfb94895044f9001b317b7fd7fc3b1b2 published to localhost:5000/emporous/getting-started:dsconfig
>````

Retrieve the manifest of the published artifact verify the attributes were added as annotations to the collection content as defined by the `DataSetConfiguration` resource.

````bash
skopeo inspect --raw --tls-verify=false docker://localhost:5000/emporous/getting-started:dsconfig | jq

{
  "schemaVersion": 2,
  "mediaType": "application/vnd.oci.image.manifest.v1+json",
  "config": {
    "mediaType": "application/vnd.emporous.config.v1+json",
    "digest": "sha256:86ab844cd9e27c9d612e226864f1fb4c5e6b6526e7e2b4fdecf0d5ff22b3524d",
    "size": 687
  },
  "layers": [
    {
      "mediaType": "image/jpeg",
      "digest": "sha256:2e30f6131ce2164ed5ef017845130727291417d60a1be6fad669bdc4473289cd",
      "size": 5536,
      "annotations": {
        "emporous.attributes": "{\"converted\":{\"org.opencontainers.image.title\":\"content/fish.jpg\"},\"unknown\":{\"animal\":\"fish\",\"content\":\"true\"}}",
        "org.opencontainers.image.title": "content/fish.jpg"
      }
    },
    {
      "mediaType": "text/plain; charset=utf-8",
      "digest": "sha256:908784d6a78ecc1e08b63aa4af486eadba500caeeb131b6406ad1bd210099386",
      "size": 19,
      "annotations": {
        "emporous.attributes": "{\"converted\":{\"org.opencontainers.image.title\":\"overview.txt\"},\"unknown\":{\"series\":\"Hawaiian\"}}",
        "org.opencontainers.image.title": "overview.txt"
      }
    },
    {
      "mediaType": "text/plain; charset=utf-8",
      "digest": "sha256:a79ec113dc7ece4dee24a5ffc967b4574c22270c99e9432773b63913ac62c95e",
      "size": 6,
      "annotations": {
        "emporous.attributes": "{\"converted\":{\"org.opencontainers.image.title\":\"content/aloha.txt\"},\"unknown\":{\"classification\":\"greeting\",\"content\":\"true\"}}",
        "org.opencontainers.image.title": "content/aloha.txt"
      }
    }
  ],
  "annotations": {
    "emporous.attributes": "{}"
  }
}
````

Notice how each layer representing the collection content now has user defined attributes associated to them. In addition, the `fish.jpg` and `aloha.txt` resources that are contained in the `content` directory have the additional annotation `content: 'true'` as they matched the wildcard pattern as defined in the `DataSetConfiguration`. Defining attributes is easy and unlocks the various ways that you will be able to interact with the content.

### Filtering Content by Attributes

Defining attributes within a collection enables the ability to restrict the content that is retrieved from a collection in a remote registry. The presence of the additional annotations does not change the default functionality of the `pull` subcommand within the client. However, it does provide the capability to specify the `--attributes` flag which allows for a set of key/value pairs to be defined which will attempt to match any of the annotation within the content.

For example, within the previously published collection, instead of retrieving all three files, let's say that we are only concerned with assets that are classified as "content". Since the attribute `content: 'true'` was defined on the `fish.jpg` and `aloha.txt` files, we can filter out only those resources when retrieving the collection.

First we'll create a `yaml` file with the filter we want to apply:

```bash
cat <<EOF> attributes.yaml
kind: AttributeQuery
apiVersion: client.emporous.io/v1alpha1
attributes:
  unknown:
    content: "true"
EOF
```

Now you can execute the following commands to _pull_ the collection containing only "content" and store the retrieved assets in a directory called `emporous-workspace-filtered`

````bash
mkdir emporous-workspace-filtered && cd emporous-workspace-filtered
emporous pull --plain-http --no-verify --attributes=../attributes.yaml localhost:5000/emporous/getting-started:dsconfig

INFO[0000] Found matching digest sha256:52c283af2991332b686a5eee855e963a1199e6a2745ff5b6a78218821a6a0e4e 
INFO[0000] Found matching digest sha256:86ab844cd9e27c9d612e226864f1fb4c5e6b6526e7e2b4fdecf0d5ff22b3524d 
INFO[0000] Found matching digest sha256:2e30f6131ce2164ed5ef017845130727291417d60a1be6fad669bdc4473289cd 
INFO[0000] Found matching digest sha256:a79ec113dc7ece4dee24a5ffc967b4574c22270c99e9432773b63913ac62c95e 
INFO[0000] Copied collection(s) to .
````

Using the `tree` command one final time, confirm that only the assets denoted by the annotation `content: 'true'` were retrieved.

````bash
~$ tree

.
└── content
    ├── aloha.txt
    └── fish.jpg

1 directory, 2 files 
````

For this occasion, only two files were retrieved with the file called `overview.txt` being omitted as it did not have the desired annotation present.

## Next Steps

Now that you have an understanding of how to interact with the Emporous, here are some additional areas of investigation to explore:

* Explore the [ORAS project](https://oras.land)
* Publishing a variety of content types within a collection
* Retrieving contents from a collection by specifying multiple attributes
