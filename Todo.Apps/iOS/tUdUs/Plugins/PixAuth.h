//
// PixAuth.h
// phoneGap1
//
// Created by Aaron saunders on 8/25/10.
// Copyright 2010 clearlyINNOVATIVE. All rights reserved.
// Modified 2011 by briankiel.

// #import
#import <Cordova/CDVPlugin.h>

@interface PixAuth : CDVPlugin {
    NSURLConnection *aConnection;
    NSURLResponse *connectionResponse;
    NSMutableData *connectionData;
    
}

- (void)loginWithBadCert:(NSMutableArray*)params withDict:(NSMutableDictionary*)options;

@end